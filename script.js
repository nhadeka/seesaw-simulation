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
    const distanceScale = 0.01;

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
            torques.totalLeftTorque += weight * (distanceFromSeesawCenter * distanceScale);
        } else {
            torques.totalRightTorque += weight * (distanceFromSeesawCenter * distanceScale);
        }
    };

    const calculateAngle = () => {
        const torqueDiff = torques.totalRightTorque - torques.totalLeftTorque;

        currentAngle = Math.max(-maxAngle, Math.min(maxAngle, (torqueDiff / 10)));

        updateAngle();
    };

    const updateAngle = () => {
        seesaw.style.transform = `translateX(-50%) rotate(${currentAngle}deg)`;
    };

    const setDataToStorage = () => {
        const data = {
            ballsData,
            currentAngle: Number(currentAngle.toFixed(1)),
            torques: {
               totalLeftTorque: Number(torques.totalLeftTorque.toFixed(1)),
               totalRightTorque: Number(torques.totalRightTorque.toFixed(1))
            }
        };

        localStorage.setItem(seesawStorageKey, JSON.stringify(data));
    };

    const getDataFromStorage = () => localStorage.getItem(seesawStorageKey);

    const loadFromStorage = () => {
        const seesawRawData = getDataFromStorage();

        if (!seesawRawData) return;

        const seesawParsedData = JSON.parse(seesawRawData);
        const { ballsData: storedBallsData, currentAngle: storedAngle, torques: storedTorques } = seesawParsedData;

        ballsData = storedBallsData;
        currentAngle = storedAngle;
        torques = storedTorques;

        ballsData.forEach(ball => {
            createBall(ball.style, ball.weight);
        });

        updateAngle();
        updateDisplay();
    };

    const clearStorage = () => {
        localStorage.removeItem(seesawStorageKey);
    };

    const updateDisplay = () => {
        rightWeightValue.innerText = `${torques.totalRightTorque.toFixed(1)} kg`;
        leftWeightValue.innerText = `${torques.totalLeftTorque.toFixed(1)} kg`;
        netWeightValue.innerText = `${Math.abs(torques.totalRightTorque - torques.totalLeftTorque).toFixed(1)} kg`;
        angleValue.innerHTML = `${currentAngle.toFixed(1)}&deg;`;
    };

    const resetSeesaw = () => {
        ballsData = [];
        torques = { totalLeftTorque: 0, totalRightTorque: 0 };
        currentAngle = 0;
        seesaw.innerHTML = '';

        updateAngle();
        updateDisplay();
        clearStorage();
    };

    loadFromStorage();

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
            updateDisplay();

            ballsData.push(ballInfoObj);

            setDataToStorage();

        }
    });

    resetButton.addEventListener('click', resetSeesaw);
};

document.addEventListener('DOMContentLoaded', init);
