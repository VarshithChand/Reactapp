from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
from sqlalchemy import create_engine, text
import os
from uuid import uuid4
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# 🔗 Database
DATABASE_URL =  "postgresql://postgres:150711@localhost:5432/postgres"
engine = create_engine(DATABASE_URL)

# 📂 Upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def ensure_schema():
    with engine.begin() as conn:

        # USERS TABLE
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE NOT NULL,
                email TEXT,
                contact TEXT,
                password TEXT NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                is_approved BOOLEAN DEFAULT TRUE,
                profile_photo TEXT
            )
        """))

        # FILES TABLE
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS files (
                id SERIAL PRIMARY KEY,
                filename TEXT NOT NULL,
                uploaded_by TEXT,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))

        # COURSE ACCESS TABLE
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS course_access (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                course_name TEXT NOT NULL,
                access_level TEXT NOT NULL CHECK (access_level IN ('demo', 'full')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, course_name)
            )
        """))


ensure_schema()


# CREATE DEFAULT ADMIN
with engine.begin() as conn:
    admin_exists = conn.execute(
        text("SELECT * FROM users WHERE name='admin'")
    ).fetchone()

    if not admin_exists:
        conn.execute(
            text("""
                INSERT INTO users
                (name, email, contact, password, is_admin, is_approved)
                VALUES
                ('admin', 'admin@test.com', '9999999999', 'admin123', TRUE, TRUE)
            """)
        )

print("Admin user ready ✅")

# =========================
# 🔐 USER AUTH
# =========================

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    is_approved = bool(data.get("is_approved", False))

    with engine.connect() as conn:
        conn.execute(
            text("""
                INSERT INTO users (name, email, contact, password, is_admin, is_approved)
                VALUES (:name, :email, :contact, :password, FALSE, :is_approved)
            """),
            {
                "name": data["name"],
                "email": data["email"],
                "contact": data["contact"],
                "password": data["password"],
                "is_approved": is_approved,
            }
        )
        conn.commit()

    return jsonify({"message": "User registered. Waiting for admin approval."})


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT * FROM users WHERE name=:name AND password=:password"),
            data
        ).fetchone()

    if result:
        user = dict(result._mapping)
        if not user["is_admin"] and not user["is_approved"]:
            return jsonify({"error": "Your account is waiting for admin approval."}), 403

        return jsonify({
            "message": "Login successful ✅",
            "is_admin": user["is_admin"]
        })
    else:
        return jsonify({"error": "Invalid credentials ❌"}), 401


# =========================
# 👤 USER MANAGEMENT
# =========================

@app.route("/api/users", methods=["GET"])
def get_users():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM users"))
        users = [dict(row._mapping) for row in result]

    return jsonify(users)


@app.route("/api/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM users WHERE id=:id"), {"id": user_id})
        conn.commit()

    return jsonify({"message": "User deleted ✅"})


@app.route("/api/users/<int:user_id>", methods=["PUT"])
def update_password(user_id):
    data = request.get_json()

    with engine.connect() as conn:
        conn.execute(
            text("UPDATE users SET password=:password WHERE id=:id"),
            {"password": data["password"], "id": user_id}
        )
        conn.commit()

    return jsonify({"message": "Password updated ✅"})


@app.route("/api/users/<int:user_id>/approve", methods=["PUT"])
def approve_user(user_id):
    with engine.connect() as conn:
        conn.execute(
            text("UPDATE users SET is_approved=TRUE WHERE id=:id"),
            {"id": user_id}
        )
        conn.commit()

    return jsonify({"message": "User approved"})


@app.route("/api/users/<int:user_id>/reject", methods=["DELETE"])
def reject_user(user_id):
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM users WHERE id=:id"), {"id": user_id})
        conn.commit()

    return jsonify({"message": "User rejected"})


@app.route("/api/users/name/<username>", methods=["GET"])
def get_user_by_username(username):
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT id, name, email, contact, profile_photo FROM users WHERE name=:name"),
            {"name": username}
        ).fetchone()

    if result:
        user = dict(result._mapping)
        return jsonify(user)
    else:
        return jsonify({"error": "User not found"}), 404


@app.route("/api/users/name/<username>", methods=["PUT"])
def update_user_by_username(username):
    data = request.get_json()

    try:
        with engine.begin() as conn:
            conn.execute(
                text("UPDATE users SET name=:name, email=:email, contact=:contact WHERE name=:username"),
                {
                    "name": data.get("name"),
                    "email": data.get("email"),
                    "contact": data.get("contact"),
                    "username": username
                }
            )
        return jsonify({"message": "User updated ✅"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/users/name/<username>/photo", methods=["POST"])
def update_user_photo(username):
    file = request.files.get("photo")

    if not file:
        return jsonify({"error": "No photo"}), 400

    filename = secure_filename(file.filename)
    ext = os.path.splitext(filename)[1].lower()

    if ext not in [".png", ".jpg", ".jpeg", ".gif", ".webp"]:
        return jsonify({"error": "Only image files are allowed"}), 400

    photo_filename = f"profile_{secure_filename(username)}_{uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, photo_filename)
    file.save(filepath)

    with engine.begin() as conn:
        old_photo = conn.execute(
            text("SELECT profile_photo FROM users WHERE name=:name"),
            {"name": username}
        ).scalar()
        conn.execute(
            text("UPDATE users SET profile_photo=:photo WHERE name=:name"),
            {"photo": photo_filename, "name": username}
        )

    if old_photo:
        old_path = os.path.join(UPLOAD_FOLDER, old_photo)
        if os.path.exists(old_path):
            os.remove(old_path)

    return jsonify({
        "message": "Profile photo updated",
        "profile_photo": photo_filename
    })


# =========================
# COURSE ACCESS
# =========================

@app.route("/api/course-access", methods=["GET"])
def get_course_access():
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT ca.id, ca.user_id, u.name AS username, ca.course_name, ca.access_level
                FROM course_access ca
                JOIN users u ON u.id = ca.user_id
                ORDER BY u.name, ca.course_name
            """)
        )
        assignments = [dict(row._mapping) for row in result]

    return jsonify(assignments)


@app.route("/api/course-access/name/<username>", methods=["GET"])
def get_course_access_by_username(username):
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT ca.id, ca.user_id, u.name AS username, ca.course_name, ca.access_level
                FROM course_access ca
                JOIN users u ON u.id = ca.user_id
                WHERE u.name = :username
                ORDER BY ca.course_name
            """),
            {"username": username}
        )
        assignments = [dict(row._mapping) for row in result]

    return jsonify(assignments)


@app.route("/api/course-access", methods=["POST"])
def assign_course_access():
    data = request.get_json()
    user_id = data.get("user_id")
    course_name = data.get("course_name")
    access_level = data.get("access_level")

    if not user_id or not course_name or access_level not in ["demo", "full"]:
        return jsonify({"error": "Invalid assignment"}), 400

    with engine.begin() as conn:
        conn.execute(
            text("""
                INSERT INTO course_access (user_id, course_name, access_level)
                VALUES (:user_id, :course_name, :access_level)
                ON CONFLICT (user_id, course_name)
                DO UPDATE SET access_level = EXCLUDED.access_level
            """),
            {
                "user_id": user_id,
                "course_name": course_name,
                "access_level": access_level
            }
        )

    return jsonify({"message": "Course access saved"})


@app.route("/api/course-access/<int:assignment_id>", methods=["DELETE"])
def delete_course_access(assignment_id):
    with engine.begin() as conn:
        conn.execute(
            text("DELETE FROM course_access WHERE id=:id"),
            {"id": assignment_id}
        )

    return jsonify({"message": "Course access removed"})


# =========================
# 📂 FILE MANAGEMENT (UPDATED)
# =========================

# 📤 UPLOAD FILE
@app.route("/api/upload", methods=["POST"])
def upload_file():
    file = request.files.get("file")
    username = request.form.get("username")  # 👈 NEW

    if not file:
        return jsonify({"error": "No file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    file.save(filepath)

    # 🔥 Save file info in DB
    with engine.connect() as conn:
        conn.execute(
            text("INSERT INTO files (filename, uploaded_by) VALUES (:f, :u)"),
            {"f": filename, "u": username}
        )
        conn.commit()

    return jsonify({
        "message": "File uploaded ✅",
        "filename": filename
    })


# 📁 GET FILES (FROM DB)
@app.route("/api/files", methods=["GET"])
def get_files():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM files ORDER BY id DESC"))
        files = [dict(row._mapping) for row in result]

    return jsonify(files)


# 👁 VIEW FILE
@app.route("/uploads/<path:filename>")
def view_file(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404

    return send_file(filepath)


# 📥 DOWNLOAD FILE
@app.route("/api/download/<path:filename>")
def download_file(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404

    return send_from_directory(
        UPLOAD_FOLDER,
        filename,
        as_attachment=True
    )


# ❌ DELETE FILE
@app.route("/api/files/<path:filename>", methods=["DELETE"])
def delete_file(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with engine.connect() as conn:
        conn.execute(
            text("DELETE FROM files WHERE filename=:f"),
            {"f": filename}
        )
        conn.commit()

    if os.path.exists(filepath):
        os.remove(filepath)

    return jsonify({"message": "File deleted ✅"})


# =========================
# 🧪 TEST
# =========================

@app.route("/api/message", methods=["GET"])
def message():
    return jsonify({"message": "Backend running ✅"})


# =========================
# ▶️ RUN
# =========================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
