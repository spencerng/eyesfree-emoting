import cv2
import sys

emotes = ["angry", "yay", "laugh", "like", "love", "sad"]


def match(img):
    img_gray = cv2.bitwise_not(cv2.imread(img, 0))
    cv2.imshow("", img_gray)
    cv2.waitKey()
    ret, thresh = cv2.threshold(img_gray, 127, 255, 0)
    contours, hierarchy = cv2.findContours(thresh, 2, 1)[-2:]
    cnt1 = contours[0]

    similarity = dict()
    for emote in emotes:
        template = cv2.bitwise_not(cv2.imread(f"templates/{emote}.png", 0))
        # TODO: Fix this scaling
        template = cv2.resize(
            template, (int(template.shape[1] * 0.4), int(template.shape[0] * 0.4))
        )

        ret, thresh2 = cv2.threshold(template, 127, 255, 0)
        contours, hierarchy = cv2.findContours(thresh2, 2, 1)[-2:]
        cnt2 = contours[0]

        # This generates a similarity score
        ret = cv2.matchShapes(cnt1, cnt2, 1, 0.0)

        similarity[emote] = ret
        
    similarity = dict(sorted(similarity.items(), key=lambda x: x[1], reverse=True))
    print(similarity)


if __name__ == "__main__":
    match(sys.argv[1])
