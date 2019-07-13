'use strict';
// получаем элементы интерфейса
const refs = {
  form: document.querySelector('#form'),
  formBtnStart: form.querySelector('#form-button-start'),
  formBtnStop: form.querySelector('#form-button-stop'),
  input: form.querySelector('#date-input'),
};

class CountdownTimer {
  constructor({ selector, targetDate }) {
    this.selector = selector;
    this.targetDate = targetDate;
  }

  // переводим введенную дату в мс
  getTargetDate() {
    return this.targetDate.getTime();
  }

  //  получаем текущую дату в мс
  getCurrentDate() {
    return Date.now();
  }

  // запуск таймера
  startTimer() {
    // Проверяем чтоб дата была больше текущей
    const passed = this.getTargetDate() - this.getCurrentDate() <= 0;
    if (passed) {
      console.log('Заданое время наступило!');
      return;
    }

    // рассчитываем время
    this.timerId = setInterval(() => {
      const time = this.getTargetDate() - this.getCurrentDate();

      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      const hours = String(
        Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      ).padStart(2, '0');
      const mins = String(
        Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)),
      ).padStart(2, '0');
      const secs = String(Math.floor((time % (1000 * 60)) / 1000)).padStart(
        2,
        '0',
      );

      // обновляем интерфейс таймера
      updateClockface(this.selector, days, hours, mins, secs);

      // когда время истекло, останавливаем таймер
      if (time <= 0) {
        this.stopTimer();
        console.log('Заданое время наступило!');
        return;
      }
    }, 1000);

    // если таймер активен, запрещаем ввод даты и запуск таймера
    refs.formBtnStart.disabled = true;
    refs.input.disabled = true;
    refs.input.value = '';
    refs.formBtnStart.classList.add('btnDisabled');
  }

  // сброс таймера
  stopTimer() {
    clearInterval(this.timerId);
    updateClockface(this.selector, '00', '00', '00', '00');

    // разрешаем ввод даты и запуск таймера
    refs.formBtnStart.disabled = false;
    refs.input.disabled = false;
    refs.formBtnStart.classList.remove('btnDisabled');
  }
}

// отрисовка таймера в интерфейсе
function updateClockface(selector, days, hours, mins, secs) {
  document.querySelector(
    `${selector} span[data-value="days"]`,
  ).innerHTML = days;
  document.querySelector(
    `${selector} span[data-value="hours"]`,
  ).innerHTML = hours;
  document.querySelector(
    `${selector} span[data-value="mins"]`,
  ).innerHTML = mins;
  document.querySelector(
    `${selector} span[data-value="secs"]`,
  ).innerHTML = secs;
}

//  получаем введённую пользователем дату
let userDate;

refs.input.addEventListener('change', () => {
  userDate = refs.input.value;
});

// создаем и запускаем таймер по клику на кнопку start
refs.formBtnStart.addEventListener('click', () => {
  // создаем таймер с переданной датой
  const timer = new CountdownTimer({
    selector: '#timer-1',
    targetDate: new Date(userDate),
  });

  timer.startTimer.call(timer);

  //сбрасываем таймер по клику на кнопку stop
  refs.formBtnStop.addEventListener('click', timer.stopTimer.bind(timer));
});
