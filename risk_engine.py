def calculate_risk(income, face_confidence, ai_analysis):
    score = 0

    if income < 200000:
        score += 20

    if face_confidence < 0.5:
        score += 50
    elif face_confidence < 0.7:
        score += 20

    if "High" in ai_analysis:
        score += 40
    elif "Medium" in ai_analysis:
        score += 20

    if score >= 70:
        return "HIGH RISK"
    elif score >= 40:
        return "MEDIUM RISK"
    else:
        return "LOW RISK"
