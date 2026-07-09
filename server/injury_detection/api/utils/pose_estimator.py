import cv2
import mediapipe as mp
import numpy as np
import os
import uuid
mp_pose = mp.solutions.pose


# -----------------------------
# Utility: Angle calculation
# -----------------------------
def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - \
              np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = abs(radians * 180.0 / np.pi)

    if angle > 180:
        angle = 360 - angle

    return angle


# -----------------------------
# Movement Calculation
# -----------------------------
def calculate_movement(prev_lm, curr_lm, indices):
    movement = 0.0
    for i in indices:
        dx = curr_lm[i].x - prev_lm[i].x
        dy = curr_lm[i].y - prev_lm[i].y
        movement += (dx**2 + dy**2) ** 0.5
    return movement


# -----------------------------
# Posture Evaluation
# -----------------------------
def evaluate_posture(exercise, lm):

    if exercise == "Jumping Squats":
        knee_angle = calculate_angle(
            [lm[23].x, lm[23].y],
            [lm[25].x, lm[25].y],
            [lm[27].x, lm[27].y]
        )

        if knee_angle < 140:
            return {"fault": "Knees bending correctly", "risk": 30}
        else:
            return {"fault": "Insufficient squat bend", "risk": 50}


    elif exercise == "Lunges":
        knee_angle = calculate_angle(
            [lm[23].x, lm[23].y],
            [lm[25].x, lm[25].y],
            [lm[27].x, lm[27].y]
        )

        if 80 < knee_angle < 160:
            return {"fault": "Good lunge posture", "risk": 25}
        else:
            return {"fault": "Improper lunge angle", "risk": 55}


    elif exercise == "Pushups":
        elbow_angle = calculate_angle(
            [lm[11].x, lm[11].y],
            [lm[13].x, lm[13].y],
            [lm[15].x, lm[15].y]
        )

        if elbow_angle < 140:
            return {"fault": "Good pushup depth", "risk": 25}
        else:
            return {"fault": "Arms not bending enough", "risk": 50}


    elif exercise == "Bridges":
        hip_angle = calculate_angle(
            [lm[11].x, lm[11].y],
            [lm[23].x, lm[23].y],
            [lm[25].x, lm[25].y]
        )

        if hip_angle > 150:
            return {"fault": "Good bridge posture", "risk": 20}
        else:
            return {"fault": "Hips not lifted enough", "risk": 55}


    elif exercise == "Leg Raises":

        left_knee = calculate_angle(
            [lm[23].x, lm[23].y],
            [lm[25].x, lm[25].y],
            [lm[27].x, lm[27].y]
        )

        right_knee = calculate_angle(
            [lm[24].x, lm[24].y],
            [lm[26].x, lm[26].y],
            [lm[28].x, lm[28].y]
        )

        straight_leg = max(left_knee, right_knee)

        left_distance = abs(lm[23].x - lm[27].x)
        right_distance = abs(lm[24].x - lm[28].x)

        leg_distance = max(left_distance, right_distance)

        if straight_leg > 55 and leg_distance > 0.30:
            return {"fault": "Good leg raise", "risk": 5}
        else:
            return {"fault": "Legs not raised high enough", "risk": 80}

    elif exercise == "Mountain Climbers":
        body_angle = calculate_angle(
            [lm[11].x, lm[11].y],
            [lm[23].x, lm[23].y],
            [lm[27].x, lm[27].y]
        )

        if 140 < body_angle < 190:
            return {"fault": "Good climber posture", "risk": 25}
        else:
            return {"fault": "Body alignment incorrect", "risk": 55}


    return {"fault": "Good posture", "risk": 20}
# -----------------------------
# Suggestions
# -----------------------------
def get_suggestions(fault):

    suggestions = {

        "Insufficient squat bend": [
            "Bend your knees further",
            "Lower your hips slightly"
        ],

        "Improper lunge angle": [
            "Keep front knee aligned with ankle",
            "Avoid excessive forward lean"
        ],

        "Arms not bending enough": [
            "Lower your body further",
            "Maintain full pushup range of motion"
        ],

        "Hips not lifted enough": [
            "Lift hips higher",
            "Engage glute muscles"
        ],

        "Legs not raised high enough": [
            "Raise legs further upward",
            "Keep legs straight"
        ],

        "Body alignment incorrect": [
            "Maintain a straight body line",
            "Avoid excessive hip movement"
        ],

        "Good posture": [
            "Maintain current form"
        ]
    }

    return suggestions.get(
        fault,
        ["Perform controlled movements"]
    )


def draw_red_joint(frame, landmark, width, height):

    x = int(landmark.x * width)
    y = int(landmark.y * height)

    cv2.circle(
        frame,
        (x, y),
        8,
        (0,0,255),
        -1
    )

def draw_red_connection(frame, lm1, lm2, width, height):

    p1 = (int(lm1.x * width), int(lm1.y * height))
    p2 = (int(lm2.x * width), int(lm2.y * height))

    cv2.line(
        frame,
        p1,
        p2,
        (0,0,255),
        5
    )
# -----------------------------
# Main Analysis Engine
# -----------------------------
def analyze_video(video_path, exercise_name):

    cap = cv2.VideoCapture(video_path)

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    if fps <= 1 or fps > 120:
        fps = 30

    print("Using FPS:", fps)
    

    processed_dir = os.path.join("media", "processed")
    os.makedirs(processed_dir, exist_ok=True)

    output_path = os.path.join(
        processed_dir,
        f"processed_{uuid.uuid4()}.mp4"
        )
    
    written = 0

    writer = cv2.VideoWriter(
        output_path,
        cv2.VideoWriter_fourcc(*'mp4v'),
        fps,
        (width, height)
    )
    print("Writer opened:", writer.isOpened())

    pose = mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,
        smooth_landmarks=True,
        min_detection_confidence=0.6,
        min_tracking_confidence=0.6
    )

    MIN_MOTION_RATIO = 0.20
    INVALID_EX_THRESHOLD = 0.18

    motion_indices = [11, 13, 15, 23, 25, 27]

    total_frames = 0
    valid_pose_frames = 0
    motion_frames = 0
    improper_frames = 0
    fault_counter = {}
    exercise_match_frames = 0

    prev_landmarks = None
    frame_skip = 1
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        if frame_count % frame_skip != 0:
            continue

        total_frames += 1

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)
        annotated = frame.copy()

        if not results.pose_landmarks:
            writer.write(frame)
            written += 1
            continue

        lm = results.pose_landmarks.landmark
        cv2.putText(
            annotated,
            f"Exercise : {exercise_name}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 255),
            2
        )
        cv2.putText(
            annotated,
            f"FPS : {int(fps)}",
            (20, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 255),
            2
        )
        cv2.putText(
            annotated,
            "AI STATUS : ACTIVE",
            (20,120),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0,255,0),
            2
        )
        for landmark in lm:

            x = int(landmark.x * width)
            y = int(landmark.y * height)

            cv2.circle(
                annotated,
                (x, y),
                5,
                (0,255,0),
                -1
            )

        drawing = mp.solutions.drawing_utils

        landmark_spec = drawing.DrawingSpec(
            color=(0,255,0),      # Green joints
            thickness=2,
            circle_radius=4
        )

        connection_spec = drawing.DrawingSpec(
            color=(255,255,255),  # White skeleton
            thickness=2
        )

        drawing.draw_landmarks(
            annotated,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS,
            landmark_drawing_spec=landmark_spec,
            connection_drawing_spec=connection_spec
        )

        valid_pose_frames += 1

        # Early stop
        if valid_pose_frames > 300:
            break

        # Motion detection
        if prev_landmarks:
            movement = calculate_movement(prev_landmarks, lm, motion_indices)
            if movement > 0.01:
                motion_frames += 1

        prev_landmarks = lm

        # -------- EXERCISE VALIDATION --------
        if exercise_name == "Jumping Squats":
            knee_angle = calculate_angle(
                [lm[23].x, lm[23].y],
                [lm[25].x, lm[25].y],
                [lm[27].x, lm[27].y]
                )
            if knee_angle < 150:
                exercise_match_frames += 1


        elif exercise_name == "Lunges":

            left_knee = calculate_angle(
                [lm[23].x, lm[23].y],
                [lm[25].x, lm[25].y],
                [lm[27].x, lm[27].y]
            )

            right_knee = calculate_angle(
                 [lm[24].x, lm[24].y],
                 [lm[26].x, lm[26].y],
                 [lm[28].x, lm[28].y]
            )

            bent_knee = min(left_knee, right_knee)

            ankle_distance = abs(lm[27].x - lm[28].x)

            # print(
            #     f"Left Knee: {left_knee:.2f}, "
            #     f"Right Knee: {right_knee:.2f}, "
            #     f"Bent Knee: {bent_knee:.2f}"
            # )
            # print("Bent:", bent_knee)
            # print("Ankle:", ankle_distance)
            if (
                65 <= bent_knee <= 145
             ):
                exercise_match_frames += 1

        elif exercise_name == "Pushups":
            elbow_angle = calculate_angle(
                [lm[11].x, lm[11].y],
                [lm[13].x, lm[13].y],   
                [lm[15].x, lm[15].y]
                )
            shoulder_y = lm[11].y
            hip_y = lm[23].y
            body_horizontal = abs(shoulder_y - hip_y) < 0.2
            if elbow_angle < 160 and body_horizontal:
                exercise_match_frames += 1
                
        elif exercise_name == "Bridges":

            left_hip_angle = calculate_angle(
              [lm[11].x, lm[11].y],
              [lm[23].x, lm[23].y],
                [lm[25].x, lm[25].y]
        )

            right_hip_angle = calculate_angle(
             [lm[12].x, lm[12].y],
             [lm[24].x, lm[24].y],
             [lm[26].x, lm[26].y]
        )

            hip_angle = max(left_hip_angle, right_hip_angle)

            shoulder_level = abs(lm[11].y - lm[12].y)
            hip_level = abs(lm[23].y - lm[24].y)

        #     print(
        #     f"Hip Angle: {hip_angle:.2f}, "
        #     f"Shoulder Level: {shoulder_level:.2f}, "
        #     f"Hip Level: {hip_level:.2f}"
        #  )

            if (
                hip_angle > 145 and
                shoulder_level < 0.10 and
                hip_level < 0.10
            ):
                exercise_match_frames += 1
            
        elif exercise_name == "Leg Raises":

    # Left leg
            left_knee = calculate_angle(
                [lm[23].x, lm[23].y],
                [lm[25].x, lm[25].y],
                [lm[27].x, lm[27].y]
            )

    # Right leg
            right_knee = calculate_angle(
                [lm[24].x, lm[24].y],
                [lm[26].x, lm[26].y],
                [lm[28].x, lm[28].y]
            )

            straight_leg = max(left_knee, right_knee)

    # How high is each ankle compared to the hip?
            left_raise = abs(lm[23].x - lm[27].x)
            right_raise = abs(lm[24].x - lm[28].x)

            leg_raise = max(left_raise, right_raise)

            print(
                f"Straight Leg: {straight_leg:.2f}, "
                f"Leg Distance: {leg_raise:.2f}"
            )

            if (
                straight_leg > 55 and
                leg_raise > 0.30
            ):
                exercise_match_frames += 1
                
        elif exercise_name == "Mountain Climbers":

            left_knee = lm[25].y
            right_knee = lm[26].y

            left_hip = lm[23].y
            right_hip = lm[24].y

            shoulder_y = lm[11].y
            hip_y = lm[23].y

            plank = abs(shoulder_y - hip_y) < 0.20

            knee_drive = (
                abs(left_knee - left_hip) > 0.08 or
                abs(right_knee - right_hip) > 0.08
            )

            if plank and knee_drive:
                exercise_match_frames += 1

        # Posture evaluation
        result = evaluate_posture(exercise_name, lm)
        fault = result["fault"]
        
        if result["risk"] > 40:
            cv2.putText(
            annotated,
            "WARNING : " + fault,
            (20,160),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0,0,255),
            2
        )
        # ==========================
        # Highlight incorrect joints
        # ==========================

        if fault == "Arms not bending enough":

            draw_red_connection(annotated, lm[11], lm[13], width, height)
            draw_red_connection(annotated, lm[13], lm[15], width, height)

            draw_red_joint(annotated, lm[13], width, height)
            draw_red_joint(annotated, lm[15], width, height)

            draw_red_connection(annotated, lm[12], lm[14], width, height)
            draw_red_connection(annotated, lm[14], lm[16], width, height)

            draw_red_joint(annotated, lm[14], width, height)
            draw_red_joint(annotated, lm[16], width, height)
        
        elif fault == "Insufficient squat bend":

            draw_red_connection(annotated, lm[23], lm[25], width, height)
            draw_red_connection(annotated, lm[25], lm[27], width, height)

            draw_red_joint(annotated, lm[25], width, height)
            draw_red_joint(annotated, lm[27], width, height)

            draw_red_connection(annotated, lm[24], lm[26], width, height)
            draw_red_connection(annotated, lm[26], lm[28], width, height)

            draw_red_joint(annotated, lm[26], width, height)
            draw_red_joint(annotated, lm[28], width, height)

        elif fault == "Improper lunge angle":

            draw_red_connection(annotated, lm[23], lm[25], width, height)
            draw_red_connection(annotated, lm[25], lm[27], width, height)

            draw_red_joint(annotated, lm[25], width, height)
            draw_red_joint(annotated, lm[27], width, height)


        elif fault == "Body alignment incorrect":

            draw_red_connection(annotated, lm[11], lm[23], width, height)
            draw_red_connection(annotated, lm[12], lm[24], width, height)

            draw_red_joint(annotated, lm[23], width, height)
            draw_red_joint(annotated, lm[24], width, height)

        elif fault == "Hips not lifted enough":

            draw_red_connection(annotated, lm[11], lm[23], width, height)
            draw_red_connection(annotated, lm[12], lm[24], width, height)

            draw_red_joint(annotated, lm[23], width, height)
            draw_red_joint(annotated, lm[24], width, height)

        elif fault == "Legs not raised high enough":

            draw_red_connection(annotated, lm[23], lm[25], width, height)
            draw_red_connection(annotated, lm[25], lm[27], width, height)

            draw_red_joint(annotated, lm[27], width, height)

            draw_red_connection(annotated, lm[24], lm[26], width, height)
            draw_red_connection(annotated, lm[26], lm[28], width, height)

            draw_red_joint(annotated, lm[28], width, height)

        if result["risk"] > 40:
            improper_frames += 1
            fault_counter[result["fault"]] = fault_counter.get(result["fault"], 0) + 1

        writer.write(annotated)
        cv2.imwrite("test_frame.jpg", annotated)
        written += 1

    cap.release()
    writer.release()
    import subprocess

    fixed_output = output_path.replace(".mp4", "_fixed.mp4")

    ffmpeg_path = r"C:\ffmpeg-2026-07-06-git-c6498178bb-essentials_build\ffmpeg-2026-07-06-git-c6498178bb-essentials_build\bin\ffmpeg.exe"

    subprocess.run([
        ffmpeg_path,
        "-y",
        "-i", output_path,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        fixed_output
    ], check=True)

    output_path = fixed_output

    pose.close()

    # if os.path.exists(video_path):
    #     os.remove(video_path)

    # No pose
    if valid_pose_frames == 0:
        return {
            "status": "no_pose",
            "message": "No person detected"
        }

    # No movement
    motion_ratio = motion_frames / valid_pose_frames
    if motion_ratio < MIN_MOTION_RATIO:
        return {
            "status": "exercise_not_detected",
            "message": "No exercise movement detected"
        }
    print("Valid Pose Frames:", valid_pose_frames)
    print("Exercise Match Frames:", exercise_match_frames)
    print("Threshold:", valid_pose_frames * INVALID_EX_THRESHOLD)

    MIN_MATCH_FRAMES = 5

    if exercise_match_frames < MIN_MATCH_FRAMES:
        return {
        "status": "invalid_exercise",
        "message": "Exercise does not match selection"
        }

    # Final metrics
    risk_percent = int((improper_frames / valid_pose_frames) * 100)
    final_fault = max(fault_counter, key=fault_counter.get) if fault_counter else "Good posture"
    accuracy = max(0, 100 - risk_percent)
    processed_video_url = "/media/processed/" + os.path.basename(output_path)

    return {
        "exercise": exercise_name,
        "status": "analysis_complete",
        "risk_percent": risk_percent,
        "fault": final_fault,
        "suggestions": get_suggestions(final_fault),
        "accuracy_score": accuracy,
        "processed_video": processed_video_url
    }







# import cv2
# import mediapipe as mp
# import numpy as np
# import os

# mp_pose = mp.solutions.pose


# # -----------------------------
# # Utility: Angle calculation
# # -----------------------------
# def calculate_angle(a, b, c):
#     a = np.array(a)
#     b = np.array(b)
#     c = np.array(c)

#     radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - \
#               np.arctan2(a[1] - b[1], a[0] - b[0])
#     angle = abs(radians * 180.0 / np.pi)

#     if angle > 180:
#         angle = 360 - angle

#     return angle


# # -----------------------------
# # Movement Calculation
# # -----------------------------
# def calculate_movement(prev_lm, curr_lm, indices):
#     movement = 0.0
#     for i in indices:
#         dx = curr_lm[i].x - prev_lm[i].x
#         dy = curr_lm[i].y - prev_lm[i].y
#         movement += (dx**2 + dy**2) ** 0.5
#     return movement


# # -----------------------------
# # Posture Evaluation
# # -----------------------------
# def evaluate_posture(exercise, lm):

#     if exercise == "Jumping Squats":
#         knee_angle = calculate_angle(
#             [lm[23].x, lm[23].y],
#             [lm[25].x, lm[25].y],
#             [lm[27].x, lm[27].y]
#         )

#         if knee_angle < 140:
#             return {"fault": "Knees bending correctly", "risk": 30}
#         else:
#             return {"fault": "Insufficient squat bend", "risk": 50}


#     elif exercise == "Lunges":
#         knee_angle = calculate_angle(
#             [lm[23].x, lm[23].y],
#             [lm[25].x, lm[25].y],
#             [lm[27].x, lm[27].y]
#         )

#         if 80 < knee_angle < 160:
#             return {"fault": "Good lunge posture", "risk": 25}
#         else:
#             return {"fault": "Improper lunge angle", "risk": 55}


#     elif exercise == "Pushups":
#         elbow_angle = calculate_angle(
#             [lm[11].x, lm[11].y],
#             [lm[13].x, lm[13].y],
#             [lm[15].x, lm[15].y]
#         )

#         if elbow_angle < 140:
#             return {"fault": "Good pushup depth", "risk": 25}
#         else:
#             return {"fault": "Arms not bending enough", "risk": 50}


#     elif exercise == "Bridges":
#         hip_angle = calculate_angle(
#             [lm[11].x, lm[11].y],
#             [lm[23].x, lm[23].y],
#             [lm[25].x, lm[25].y]
#         )

#         if hip_angle > 150:
#             return {"fault": "Good bridge posture", "risk": 20}
#         else:
#             return {"fault": "Hips not lifted enough", "risk": 55}


#     elif exercise == "Leg Raises":
#         leg_angle = calculate_angle(
#             [lm[23].x, lm[23].y],
#             [lm[25].x, lm[25].y],
#             [lm[27].x, lm[27].y]
#         )

#         if leg_angle > 150:
#             return {"fault": "Good leg raise", "risk": 20}
#         else:
#             return {"fault": "Legs not raised high enough", "risk": 50}


#     elif exercise == "Mountain Climbers":
#         body_angle = calculate_angle(
#             [lm[11].x, lm[11].y],
#             [lm[23].x, lm[23].y],
#             [lm[27].x, lm[27].y]
#         )

#         if 140 < body_angle < 190:
#             return {"fault": "Good climber posture", "risk": 25}
#         else:
#             return {"fault": "Body alignment incorrect", "risk": 55}


#     return {"fault": "Good posture", "risk": 20}

# # -----------------------------
# # Suggestions
# # -----------------------------
# def get_suggestions(fault):

#     suggestions = {

#         "Insufficient squat bend": [
#             "Bend your knees further",
#             "Lower your hips slightly"
#         ],

#         "Improper lunge angle": [
#             "Keep front knee aligned with ankle",
#             "Avoid excessive forward lean"
#         ],

#         "Arms not bending enough": [
#             "Lower your body further",
#             "Maintain full pushup range of motion"
#         ],

#         "Hips not lifted enough": [
#             "Lift hips higher",
#             "Engage glute muscles"
#         ],

#         "Legs not raised high enough": [
#             "Raise legs further upward",
#             "Keep legs straight"
#         ],

#         "Body alignment incorrect": [
#             "Maintain a straight body line",
#             "Avoid excessive hip movement"
#         ],

#         "Good posture": [
#             "Maintain current form"
#         ]
#     }

#     return suggestions.get(
#         fault,
#         ["Perform controlled movements"]
#     )
# # -----------------------------
# # Main Analysis Engine
# # -----------------------------
# def analyze_video(video_path, exercise_name):

#     cap = cv2.VideoCapture(video_path)

#     pose = mp_pose.Pose(
#         model_complexity=0,
#         min_detection_confidence=0.5,
#         min_tracking_confidence=0.5
#     )

#     MIN_MOTION_RATIO = 0.20
#     INVALID_EX_THRESHOLD = 0.15

#     motion_indices = [11, 13, 15, 23, 25, 27]

#     total_frames = 0
#     valid_pose_frames = 0
#     motion_frames = 0
#     improper_frames = 0
#     fault_counter = {}
#     exercise_match_frames = 0

#     prev_landmarks = None
#     frame_skip = 3
#     frame_count = 0

#     while cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             break

#         frame_count += 1
#         if frame_count % frame_skip != 0:
#             continue

#         total_frames += 1

#         image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         results = pose.process(image)

#         if not results.pose_landmarks:
#             continue

#         lm = results.pose_landmarks.landmark
#         valid_pose_frames += 1

#         # Early stop
#         if valid_pose_frames > 60:
#             break

#         # Motion detection
#         if prev_landmarks:
#             movement = calculate_movement(prev_landmarks, lm, motion_indices)
#             if movement > 0.01:
#                 motion_frames += 1

#         prev_landmarks = lm

#         # -------- EXERCISE VALIDATION --------
#         if exercise_name == "Jumping Squats":
#             knee_angle = calculate_angle(
#                 [lm[23].x, lm[23].y],
#                 [lm[25].x, lm[25].y],
#                 [lm[27].x, lm[27].y]
#                 )
#             if knee_angle < 150:
#                 exercise_match_frames += 1


#         elif exercise_name == "Lunges":
#             knee_angle = calculate_angle(
#                [lm[23].x, lm[23].y],
#                [lm[25].x, lm[25].y],
#                [lm[27].x, lm[27].y]
#                )
#             if 70 < knee_angle < 170:
#                 exercise_match_frames += 1


#         elif exercise_name == "Pushups":
#             elbow_angle = calculate_angle(
#                 [lm[11].x, lm[11].y],
#                 [lm[13].x, lm[13].y],
#                 [lm[15].x, lm[15].y]
#                 )
#             shoulder_y = lm[11].y
#             hip_y = lm[23].y
#             body_horizontal = abs(shoulder_y - hip_y) < 0.2
#             if elbow_angle < 160 and body_horizontal:
#                 exercise_match_frames += 1
                
#         elif exercise_name == "Bridges":
#             hip_angle = calculate_angle(
#                 [lm[11].x, lm[11].y],
#                 [lm[23].x, lm[23].y],
#                 [lm[25].x, lm[25].y]
#                 )
#             if hip_angle > 130:
#                 exercise_match_frames += 1
            
#         elif exercise_name == "Leg Raises":
#             leg_angle = calculate_angle(
#                 [lm[23].x, lm[23].y],
#                 [lm[25].x, lm[25].y],
#                 [lm[27].x, lm[27].y]
#                 )
#             if leg_angle > 140:
#                 exercise_match_frames += 1
                
#         elif exercise_name == "Mountain Climbers":
#             knee_height = abs(lm[25].y - lm[23].y)
#             if knee_height < -0.05 or knee_height > 0.05:
#                 exercise_match_frames += 1

#         result = evaluate_posture(exercise_name, lm)

#         if result["risk"] > 40:
#             improper_frames += 1
#             fault_counter[result["fault"]] = fault_counter.get(result["fault"], 0) + 1

#     cap.release()
#     pose.close()

#     if os.path.exists(video_path):
#         os.remove(video_path)

#     # No pose
#     if valid_pose_frames == 0:
#         return {
#             "status": "no_pose",
#             "message": "No person detected"
#         }

#     # No movement
#     motion_ratio = motion_frames / valid_pose_frames
#     if motion_ratio < MIN_MOTION_RATIO:
#         return {
#             "status": "exercise_not_detected",
#             "message": "No exercise movement detected"
#         }

#     # Invalid exercise
#     if exercise_match_frames < valid_pose_frames * INVALID_EX_THRESHOLD:
#         return {
#             "status": "invalid_exercise",
#             "message": "Exercise does not match selection"
#         }

#     # Final metrics
#     risk_percent = int((improper_frames / valid_pose_frames) * 100)
#     final_fault = max(fault_counter, key=fault_counter.get) if fault_counter else "Good posture"
#     accuracy = max(0, 100 - risk_percent)

#     return {
#         "exercise": exercise_name,
#         "status": "analysis_complete",
#         "risk_percent": risk_percent,
#         "fault": final_fault,
#         "suggestions": get_suggestions(final_fault),
#         "accuracy_score": accuracy
#     }