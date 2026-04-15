from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
from sqlalchemy import create_engine, text
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# 🔗 Database
DATABASE_URL = "postgresql://postgres:150711@localhost:5432/myapp"
engine = create_engine(DATABASE_URL)

# 📂 Upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# =========================
# 🔐 USER AUTH
# =========================

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    with engine.connect() as conn:
        conn.execute(
            text("""
                INSERT INTO users (name, email, contact, password, is_admin)
                VALUES (:name, :email, :contact, :password, FALSE)
            """),
            data
        )
        conn.commit()

    return jsonify({"message": "User registered ✅"})


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


@app.route("/api/users/name/<username>", methods=["GET"])
def get_user_by_username(username):
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT id, name, email, contact FROM users WHERE name=:name"),
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
    app.run(debug=True)