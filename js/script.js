class Color {
    constructor() {
        this.value = this.generateRandomColor();
    }

    generateRandomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
}

class NumberClass {
    constructor(value) {
        this.value = value;
    }
}

class Button {
    constructor(number, color) {
        this.number = number;
        this.color = color;
        this.element = null;
    }

    render() {
        const btn = document.createElement('button');
        btn.textContent = this.number.value;
        btn.classList.add('button');
        btn.style.backgroundColor = this.color.value;
        btn.style.position = 'static';

        this.element = btn;
        return btn;
    }

    setRandomPosition() {
        if (!this.element) {
            throw new Error("Button element is not rendered yet.");
        }

        this.element.style.position = 'absolute';
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const top = Math.random() * (windowHeight - this.element.offsetHeight);
        const left = Math.random() * (windowWidth - this.element.offsetWidth);

        this.element.style.top = `${top}px`;
        this.element.style.left = `${left}px`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const label = document.querySelector('label[for="button-count"]');
    const createButton = document.getElementById('create-button');
    const buttonCountInput = document.getElementById('button-count');
    const errorMessage = document.getElementById('error-message');
    const buttonsContainer = document.getElementById('buttons-container');
    const questionPrompt = document.getElementById('question');

    if (typeof messages !== 'undefined' && messages.prompt) {
        label.textContent = messages.prompt;
    }

    createButton.addEventListener('click', () => {
        errorMessage.textContent = '';
        buttonsContainer.innerHTML = '';

        const count = parseInt(buttonCountInput.value, 10);

        if (isNaN(count) || count < 3 || count > 7) {
            errorMessage.textContent = "Number of buttons must be between 3 and 7.";
            return;
        }

        const buttons = [];
        const originalOrder = [];
        let currentIndex = 0;
        let isGameOver = false;

        // Create buttons
        for (let i = 1; i <= count; i++) {
            const color = new Color();
            const number = new NumberClass(i);
            const button = new Button(number, color);
            buttons.push(button);
            originalOrder.push(button);
            buttonsContainer.appendChild(button.render());
        }

        // Pause for `count` seconds before scrambling
        setTimeout(() => {
            let scrambleCount = 0;

            const scrambleInterval = setInterval(() => {
                buttons.forEach(button => {
                    button.setRandomPosition();
                    button.element.textContent = '';
                });
                scrambleCount++;
                if (scrambleCount >= count) {
                    clearInterval(scrambleInterval);

                    // Hide numbers and make buttons clickable
                    buttons.forEach(button => {
                        button.element.addEventListener('click', () => {
                            if (isGameOver) return;

                            // Check the clicked button's order
                            if (button === originalOrder[currentIndex]) {
                                button.element.textContent = button.number.value;
                                currentIndex++;

                                if (currentIndex === originalOrder.length) {
                                    alert("Excellent memory!");
                                    isGameOver = true;
                                }
                            } else {
                                alert("Wrong order!");
                                isGameOver = true;

                                // Reveal the correct order
                                originalOrder.forEach(btn => {
                                    btn.element.textContent = btn.number.value;
                                });
                            }
                        });
                    });
                }
            }, 2000);
        }, count * 1000);
    });
});