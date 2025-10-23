function init() {
    const seesaw = document.getElementById('seesaw');
    const baseSize = 30;
    const weightMultiplier = 2;
    const minWeight = 1;
    const maxWeight = 10;
    const minRGB = 0;
    const maxRGB = 255;
    const maxAngle = 30;
    const seesawStorageKey = 'seesaw-storage';
    let torques = { totalLeftTorque: 0, totalRightTorque: 0 };
    let ballsData = [];

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getRandomRGBColor = () => {
        const r = getRandomInt(minRGB, maxRGB);
        const g = getRandomInt(minRGB, maxRGB);
        const b = getRandomInt(minRGB, maxRGB);

        return `rgb(${r}, ${g}, ${b})`;
    };

    const createBall = (styleObj, weight) => {
        const ball = document.createElement('div');

        ball.classList.add('ball');

        for (let prop in styleObj) {
            ball.style[prop] = styleObj[prop];
        }

        const weightLabel = document.createElement('span');

        weightLabel.textContent = weight;

        ball.append(weightLabel);
        seesaw.append(ball);
    };

    const calculateTorques = (ballTorqueInfo) => {
        const { side, weight, distanceFromSeesawCenter } = ballTorqueInfo;

        if (side === 'left') {
            torques.totalLeftTorque += weight * distanceFromSeesawCenter;
        } else {
            torques.totalRightTorque += weight * distanceFromSeesawCenter;
        }

        console.log(`total left torque = ${torques.totalLeftTorque},total right torque = ${torques.totalRightTorque}`);
    };

    const calculateAngle = () => {
        const torqueDiff = torques.totalRightTorque - torques.totalLeftTorque;
        const angle = Math.max(-maxAngle, Math.min(maxAngle, (torqueDiff / 10)));

        seesaw.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    };

    const setDataToStorage = () => {
        const data = { ballsData, torques };

        localStorage.setItem(seesawStorageKey, JSON.stringify(data));
    };

    const loadFromStorage = () => {
        const seesawRawData = localStorage.getItem(seesawStorageKey);

        if (seesawRawData) {
            const seesawParsedData = JSON.parse(seesawRawData);

            ballsData = seesawParsedData.ballsData;

            seesawParsedData.ballsData.forEach(ball => {
                createBall(ball.style, ball.weight);
            });

            torques = seesawParsedData.torques;

            calculateAngle();
        }
    };

    loadFromStorage();

    seesaw.addEventListener('click', function (event) {
        if (event.target === event.currentTarget) {
            const seesawRect = seesaw.getBoundingClientRect();
            const clickXOnSeesaw = event.clientX - seesawRect.x;
            const seesawCenterX = seesawRect.x + seesawRect.width / 2;
            const distanceFromSeesawCenter = Math.abs(event.clientX - seesawCenterX);

            if (event.clientX === seesawCenterX) {
                console.log('clicked center');

                return;
            }

            let side;
            const weight = getRandomInt(minWeight, maxWeight);
            const size = baseSize + weight * weightMultiplier;
            const ballRadius = size / 2;
            const left = clickXOnSeesaw - ballRadius;

            const styleObj = {
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: `${getRandomRGBColor()}`,
                left:`${left}px`,
            };

            side = event.clientX < seesawCenterX ? 'left' : 'right';

            const ballTorqueInfo = { side, weight, distanceFromSeesawCenter };
            const ballInfoObj = { style: styleObj, weight };

            createBall(styleObj,weight);
            calculateTorques(ballTorqueInfo);
            calculateAngle();

            ballsData.push(ballInfoObj);

            setDataToStorage();

        }
    });
}

document.addEventListener('DOMContentLoaded', init);
