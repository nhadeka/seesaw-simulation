function init() {
    const seesaw = document.getElementById('seesaw');
    const rightWeightValue = document.getElementById('right-weight');
    const leftWeightValue = document.getElementById('left-weight');
    const netWeightValue = document.getElementById('net-weight');
    const angleValue = document.getElementById('angle');
    const resetButton = document.getElementById('reset-button');
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
    let currentAngle = 0;

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

        ball.classList.add('ball', 'flex-center');

        for (let prop in styleObj) {
            ball.style[prop] = styleObj[prop];
        }

        const weightLabel = document.createElement('span');

        weightLabel.textContent = weight;

        ball.append(weightLabel);
        seesaw.append(ball);

        requestAnimationFrame(() => {
            ball.classList.add('show');
        });
    };

    const calculateTorques = (ballTorqueInfo) => {
        const { side, weight, distanceFromSeesawCenter } = ballTorqueInfo;

        if (side === 'left') {
            torques.totalLeftTorque += weight * distanceFromSeesawCenter;
        } else {
            torques.totalRightTorque += weight * distanceFromSeesawCenter;
        }
    };

    const calculateAngle = () => {
        const torqueDiff = torques.totalRightTorque - torques.totalLeftTorque;

        currentAngle = Math.max(-maxAngle, Math.min(maxAngle, (torqueDiff / 10))).toFixed(2);

        updateAngle();
    };

    const updateAngle = () => {
        seesaw.style.transform = `translateX(-50%) rotate(${currentAngle}deg)`;
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

    const clearStorage = () => {
        localStorage.removeItem(seesawStorageKey);
    };

    const displayInfos = () => {
        rightWeightValue.innerText = torques.totalRightTorque.toFixed(2);
        leftWeightValue.innerText = torques.totalLeftTorque.toFixed(2);
        netWeightValue.innerText = Math.abs((torques.totalRightTorque - torques.totalLeftTorque)).toFixed(2);
        angleValue.innerText = Math.abs(currentAngle);
    }; 

    const resetSeesaw = () => {
        ballsData = [];
        torques = { totalLeftTorque: 0, totalRightTorque: 0 };
        currentAngle = 0;
        seesaw.innerHTML = '';

        updateAngle();
        displayInfos();
        clearStorage();
    };

    loadFromStorage();
    displayInfos();

    seesaw.addEventListener('click', (event) => {
        const { target, currentTarget, clientX } = event;

        if (target === currentTarget) {
            const seesawRect = seesaw.getBoundingClientRect();
            const clickXOnSeesaw = clientX - seesawRect.x;
            const seesawCenterX = seesawRect.x + seesawRect.width / 2;

            if (clientX === seesawCenterX) {
                return;
            }

            let side;
            const distanceFromSeesawCenter = Math.abs(clientX - seesawCenterX);
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

            side = clientX < seesawCenterX ? 'left' : 'right';

            const ballTorqueInfo = { side, weight, distanceFromSeesawCenter };
            const ballInfoObj = { style: styleObj, weight };

            createBall(styleObj,weight);
            calculateTorques(ballTorqueInfo);
            calculateAngle();
            displayInfos();

            ballsData.push(ballInfoObj);

            setDataToStorage();

        }
    });

    resetButton.addEventListener('click', resetSeesaw);
};

document.addEventListener('DOMContentLoaded', init);
