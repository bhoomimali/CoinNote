from deepface import DeepFace

def compare_faces(id_image_path, selfie_path):
    try:
        result = DeepFace.verify(
            img1_path=id_image_path,
            img2_path=selfie_path,
            model_name="Facenet",
            enforce_detection=True
        )

        confidence = 1 - result["distance"]

        return confidence

    except Exception as e:
        print("Face verification error:", e)
        return 0
