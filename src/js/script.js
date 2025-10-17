if (document.querySelector('.js_main_top_slider')) {
    new Swiper('.js_main_top_slider', {
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1000,
        autoplay: {
            delay: 7000,
        },
        navigation: {
            nextEl: ".js_main_top__slider_arrow_next",
            prevEl: ".js_main_top__slider_arrow_prev",
        },
    });
}
if (document.querySelector('.js_main_electric_slider')) {
    new Swiper('.js_main_electric_slider', {
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
            nextEl: ".js_main_electric__arrow_next",
            prevEl: ".js_main_electric__arrow_prev",
        },
    });
}

function tabs (tabLinks, tabBodies) {
    // Функция для переключения табов
    const switchTab = (tabId) => {
        // Убираем активные классы у всех ссылок и табов
        tabLinks.forEach(link => link.classList.remove('active'));
        tabBodies.forEach(body => body.classList.remove('active'));

        // Находим нужные элементы в существующих коллекциях
        const activeLink = Array.from(tabLinks).find(link => link.getAttribute('data-tab') === tabId);
        const activeBody = Array.from(tabBodies).find(body => body.getAttribute('data-tab') === tabId);

        // Добавляем активные классы
        if (activeLink) activeLink.classList.add('active');
        if (activeBody) activeBody.classList.add('active');
    };

    // Обработчик клика для каждой ссылки
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

const popularTabLinks = document.querySelectorAll('.js_main_popular_tabs_link');
if (popularTabLinks.length) {
    const popularTabBodies = document.querySelectorAll('.js_main_popular_tabs_body');
    tabs(popularTabLinks, popularTabBodies);
}

const mainFaqAccordions = document.querySelector('.js_main_faq_accordions');

if (mainFaqAccordions) {
    const mainFaqAccordionsHeads = mainFaqAccordions.querySelectorAll('.js_main_faq_accordion_head');

    mainFaqAccordions.querySelectorAll('.main_faq__accordion').forEach(acc => {
        if (acc.classList.contains('active')) {
            acc.querySelector('.js_main_faq_accordion_body').style.maxHeight = `${acc.querySelector('.js_main_faq_accordion_body').scrollHeight}px`;
        }
    });

    mainFaqAccordionsHeads.forEach(head => {
        head.addEventListener('click', function() {
            const accordion = this.closest('.main_faq__accordion');
            const isActive = accordion.classList.contains('active');

            // Закрываем все аккордеоны
            mainFaqAccordions.querySelectorAll('.main_faq__accordion').forEach(acc => {
                acc.classList.remove('active');
                acc.querySelector('.js_main_faq_accordion_body').style.maxHeight = 0;
            });

            // Если аккордеон не был активен - открываем его
            if (!isActive) {
                accordion.classList.add('active');
                accordion.querySelector('.js_main_faq_accordion_body').style.maxHeight = `${accordion.querySelector('.js_main_faq_accordion_body').scrollHeight}px`;
            }
        });
    });
}
$('.js_input_tel').inputmask('+7 999 999 99 99');
$('.js_input_tel_2').inputmask('+7 (999) 999 99 99');
$('.js_input_passport').inputmask('99 99 999 999');
$('.js_cardNumber_input').inputmask('9999 9999 9999 9999');
$('.js_cvc_input').inputmask('999');

const datePickers = document.querySelectorAll('.rental-calendar');
if (datePickers.length) {
    const lockedRanges = [
        ['2025-10-21', '2025-10-24'],
    ];

    function generateLockedDays(ranges) {
        const days = [];
        ranges.forEach(([start, end]) => {
            const s = new Date(start);
            const e = new Date(end);
            for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
                days.push(new Date(d));
            }
        });
        return days;
    }

    const lockedDays = generateLockedDays(lockedRanges);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    datePickers.forEach((datePicker) => {
        new Litepicker({
            element: datePicker,
            singleMode: false,
            format: 'DD.MM.YYYY',
            lang: 'ru-RU',
            numberOfMonths: 1,
            numberOfColumns: 1,
            lockDays: lockedDays,
            disallowLockDaysInRange: true,
            minDate: new Date() - 1,
            tooltipText: { one: 'день', few: 'дня', many: 'дней' },
            tooltipNumber: (totalDays) => totalDays - 1,
            setup: (picker) => {
                picker.on('show', () => {
                    datePicker.nextElementSibling.classList.add('show')
                    const container = picker.ui;
                    if (container) {
                        const inputWidth = datePicker.offsetWidth;
                        container.style.width = inputWidth + 'px';
                        container.style.minWidth = 'unset'; // Убираем минимальную ширину
                    }
                });
                picker.on('hide', () => {
                    datePicker.nextElementSibling.classList.remove('show')
                });

                // Обновляем ширину при изменении размера окна
                window.addEventListener('resize', () => {
                    if (picker.visible) {
                        const container = picker.ui;
                        const inputWidth = picker.element.offsetWidth;
                        if (container) {
                            container.style.width = inputWidth + 'px';
                        }
                    }
                });

                picker.on('render:day', (day, date) => {
                    // Сохраняем оригинальный текст даты
                    const dayNumber = date.getDate();

                    // Очищаем содержимое и добавляем span с числом
                    day.innerHTML = '';
                    const span = document.createElement('span');
                    span.textContent = dayNumber;
                    day.appendChild(span);
                    const d = new Date(date.getTime());
                    d.setHours(0, 0, 0, 0);

                    if (d < today) {
                        day.classList.add('is-past');
                    } else {
                        // Проверяем, находится ли дата внутри какого-либо заблокированного диапазона
                        const isInLockedRange = lockedRanges.some(([start, end]) => {
                            const startDate = new Date(start);
                            const endDate = new Date(end);
                            startDate.setHours(0,0,0,0);
                            endDate.setHours(0,0,0,0);

                            return d > startDate && d < endDate;
                        });

                        // Проверяем, является ли дата заблокированной
                        const isLocked = lockedDays.some(ld => ld.getTime() === d.getTime());

                        if (isLocked) {
                            day.classList.add('is-booked');
                        }

                        if (isInLockedRange) {
                            day.classList.add('is-locked-in-range');
                        }
                    }
                });
            }
        });
    })
}

$('.select').SumoSelect({
    nativeOnDevice: [],
});

if (document.querySelector('.price__slider')) {
// слайдер диапазона цены

    const initialMinimumValue = 1500;
    const initialMaximumValue = 124000;

    $('#price_slider').slider({
        min: initialMinimumValue,
        max: initialMaximumValue,
        range: true,
        step: 100,
        values: [initialMinimumValue, initialMaximumValue],
        stop: function(event, ui) {
            $("#minCost").text(`${$('#price_slider').slider("values",0).toLocaleString('ru-RU')} ₽`);
            $("#maxCost").text(`${$('#price_slider').slider("values",1).toLocaleString('ru-RU')} ₽`);
        },
        slide: function(event, ui){
            $("#minCost").text(`${$('#price_slider').slider("values",0).toLocaleString('ru-RU')} ₽`);
            $("#maxCost").text(`${$('#price_slider').slider("values",1).toLocaleString('ru-RU')} ₽`);
        }
    })
    $("#minCost").text(`${$('#price_slider').slider("values",0).toLocaleString('ru-RU')} ₽`);
    $("#maxCost").text(`${$('#price_slider').slider("values",1).toLocaleString('ru-RU')} ₽`);
}
if (document.getElementById('map')) {
    ymaps.ready(init);

    function init() {
        // Создаем карту
        var myMap = new ymaps.Map("map", {
            center: [55.7558, 37.6173], // Центр Москвы
            zoom: 16
        });
        var lat = 55.741632;
        var lon = 37.589473;

        // Создаем метку
        var myPlacemark = new ymaps.Placemark([lat, lon], {
            hintContent: 'Случайная точка в Москве!',
            balloonContent: 'Это случайная точка в Москве'
        }, {
            preset: 'islands#icon',
            iconColor: '#0095b6'
        });

        // Добавляем метку на карту
        myMap.geoObjects.add(myPlacemark);

        // Центрируем карту на метке
        myMap.setCenter([lat, lon]);
    }
}

const personalEditBtn = document.querySelector('.js_personal_edit_btn')
if (personalEditBtn) {
    const personalForm = document.querySelector('.js_personal_form');
    const inputs = personalForm.querySelectorAll('input');

    personalEditBtn.addEventListener('click', () => {
        personalForm.classList.add('edit');
        personalEditBtn.classList.add('hide');

        inputs.forEach((input) => {
           input.removeAttribute('readonly');
        });
    });
    personalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        personalForm.classList.remove('edit');
        personalEditBtn.classList.remove('hide');
        inputs.forEach((input) => {
            input.setAttribute('readonly', 'true');
        });
    });
}

if (document.querySelector('.js_addresses_slider')) {
    new Swiper('.js_addresses_slider', {
        slidesPerView: 'auto',
        spaceBetween: 10,
    });
}
if (document.querySelector('.js_payments_slider')) {
    new Swiper('.js_payments_slider', {
        slidesPerView: 'auto',
        spaceBetween: 10,
    });
}

const openPopupBtns = document.querySelectorAll('.js_open_popup');

if (openPopupBtns.length) {
    const popup = document.querySelector('.js_popup');
    const closeBtn = popup.querySelector('.js_popup_close')

    openPopupBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            popup.classList.add('show');
            document.body.style.overflow = 'hidden';
        })
    });
    popup.addEventListener('click', (e) => {
        if (!e.target.closest('.popup__body')) {
            popup.classList.remove('show');
            document.body.style.overflow = '';
        }
    })
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('show');
        document.body.style.overflow = '';
    })
}

const paymentsItems = document.querySelectorAll('.js_payments_item');

if (paymentsItems.length) {
    paymentsItems.forEach((item) => {
        const cardNumbers = item.querySelectorAll('.js_payments_number');
        const toggleBtn = item.querySelector('.js_toggle_number');

        let isHidden = true;

        toggleBtn.addEventListener('click', function() {
            toggleBtn.classList.toggle('active');
            isHidden = !isHidden;

            cardNumbers.forEach((cardNumber) => {
                const fullNumber = cardNumber.getAttribute('data-number');

                // Проверяем, является ли это CVC кодом
                if (cardNumber.classList.contains('js_cvc_number')) {
                    // Логика для CVC
                    if (isHidden) {
                        cardNumber.textContent = '***';
                    } else {
                        cardNumber.textContent = fullNumber;
                    }
                } else {
                    // Логика для номера карты
                    if (isHidden) {
                        // Маскируем номер карты, оставляя последние 4 цифры
                        const cleaned = fullNumber.replace(/\s/g, '');
                        const lastFour = cleaned.slice(-4);
                        const masked = '**** **** **** ' + lastFour;
                        cardNumber.textContent = masked;
                    } else {
                        cardNumber.textContent = fullNumber;
                    }
                }
            });
        });
    });
}
const orderTabLinks = document.querySelectorAll('.js_orders_tabs_link');
if (orderTabLinks.length) {
    const orderTabBodies = document.querySelectorAll('.js_orders_tabs_body');
    tabs(orderTabLinks, orderTabBodies);
}