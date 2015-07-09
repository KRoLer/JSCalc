var keys = document.querySelectorAll('.buttons div');
var buttons = document.querySelector('.buttons');
var clearBtn = document.querySelector('.clearBtn');
var input = document.querySelector('.screen input');
var operators = ['+', '-', 'x', '÷'];
var dotUsed = false;

clearBtn.addEventListener('click', function(e) {
    input.value = '';
    dotUsed = false;
});

document.addEventListener("keydown", function(e) {
    var key = e.keyCode;
    var inputValue = input.value;
    var shift = e.shiftKey;

    if (key == '27') { // Esc
        input.value = '';
        dotUsed = false;
    } else if (key == '8') { // Backspace
        input.value = inputValue.substring(0, inputValue.length - 1);
        if (inputValue[inputValue.length - 1] == '.') {
            dotUsed = false;
        }
    } else if (key == '13' || (!shift && key == '187')) { // '=' - Enter or char =
        onClickEvent('=');
    } else if (key == '111' || key == '191') { // '/' or numpad '/' 
        onClickEvent('÷');
    } else if (key == '106' || (shift && key == '56')) { // '*' or shift + 8
        onClickEvent('x');
    } else if (key == '109' || key == '189') { // '-' or numpad '-'
        onClickEvent('-');
    } else if (key == '107' || (shift && key == '187')) { // '+' or shift + =
        onClickEvent('+');
    } else if (key == '190' || key == '110') {
        onClickEvent('.');
    } else if (
        (key >= 48 && key <= 57) ||
        (key >= 96 && key <= 105)) {
        if (key > 95) {
            key -= 48;
        }
        onClickEvent(String.fromCharCode(key));
    }
    e.preventDefault();

});

/* Add one event listener instead of 16

for (var i = 0; i < keys.length; i++) {
    keys[i].addEventListener('click', function(e) {
        onClickEvent(this.innerHTML);
	});
} */

buttons.addEventListener('click', function(e){
	var inputHTML = e.target.innerHTML;
	var securityRegexp = /[0-9\+\-\x\÷\.\=]/g;
	if(inputHTML.search(securityRegexp) !=-1){
		onClickEvent(e.target.innerHTML);
	}
});

function onClickEvent(btnValue) {
    var inputValue = input.value;
    var lastChar = inputValue[inputValue.length - 1];

    if (btnValue == '=') {

        if (operators.indexOf(lastChar) > -1 || lastChar == '.') {
            inputValue = inputValue.replace(/.$/, '');
        }

        inputValue = inputValue.replace(/x/g, '*').replace(/÷/g, '/');

        try {
            var result = '';
            if (inputValue) {
                result = eval(inputValue);
            }
            if ((result + '').indexOf('.') > -1) {
                result = result.toFixed(2);
                dotUsed = true;
            } else {
                dotUsed = false;
            }
            if (result == 'Infinity') {
                throw new Error('Don\'t divide by 0 :-(');
            } else {
                input.value = result;
            }
        } catch (e) {
            input.className = input.className + ' error';
            input.value = e.message;
            setTimeout(function() {
                input.value = '';
                input.className = 'result';
            }, 2000);
        }
    } else if (operators.indexOf(btnValue) > -1) {

        if (inputValue !== '' &&
            operators.indexOf(lastChar) == -1 &&
            lastChar != '.') {
            input.value += btnValue;
            dotUsed = false;
        } else if (inputValue === '' && btnValue == '-') {
            input.value += btnValue;
        }

        if (operators.indexOf(lastChar) > -1 && inputValue.length > 1) {
            input.value = inputValue.replace(/.$/, btnValue);
        }
    } else if (btnValue == '.') {

        if (!dotUsed) {
            if (operators.indexOf(lastChar) == -1) {
                input.value += btnValue;
                dotUsed = true;
            }
        }
    } else {
        input.value += btnValue;
    }
}