let header = $('.header'),
    scrollPrev = 0;

$(window).scroll(function() {
    let scrolled = $(window).scrollTop();

    if ( scrolled > 100 && scrolled > scrollPrev ) {
        header.addClass('out');
    } else {
        header.removeClass('out');
    }
    scrollPrev = scrolled;
});

$('input[name="phone"]').mask("+375(99)999-99-99");

let baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
let newUrl = baseUrl + '?utm_source=yandex&utm_medium=cpc&utm_campaign=%7Bcampaign_name_lat%7D&utm_content=%7Bad_id%7D&utm_term=%7Bkeyword%7D';
history.pushState(null, null, newUrl);

let utms_names = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

utms_names.forEach(name => {
    let utm_inputs = document.querySelectorAll(`.${name}`);
    utm_inputs.forEach(input => {
        input.value = new URL(window.location.href).searchParams.get(`${name}`);
    });
});

function slider({containerSelector, slideSelector, nextSlideSelector, prevSlideSelector, wrapperSelector, fieldSelector, indicatorsClass, elementsPerPage = 1, elementsPerPageMobile = 1, columnGap = 0, duration = 0, swipe = false, totalCounter, currentCounter}) {
    let slideIndex = 1,
        offset = 0,
        timer = 0,
        perPage = 1,
        gap = 0,
        startX,
        endX,
        total,
        current,
        mobile = window.matchMedia('(max-width: 992px)').matches,
        templates = [],
        mainClass,
        dots = [];
    const slides = document.querySelectorAll(slideSelector),
        container = document.querySelector(containerSelector),
        prev = document.querySelector(prevSlideSelector),
        next = document.querySelector(nextSlideSelector),
        wrapper = document.querySelector(wrapperSelector),
        field = document.querySelector(fieldSelector);

    if (indicatorsClass) {
        mainClass = indicatorsClass.slice(0, -11);
    }
    if (totalCounter) {
        total = container.querySelector(totalCounter);
        total.textContent = slides.length;
    }
    if (currentCounter) {
        current = container.querySelector(currentCounter)
        current.textContent = slideIndex;
    }

    let baseSlides = slides;
    mobile ? perPage = elementsPerPageMobile : perPage = elementsPerPage;
    mobile ? gap = columnGap / 2 : gap = columnGap;
    perPage == 1 ? gap = 0 : gap = gap;
    let width = Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width) / perPage - (gap * (slides.length - 1) / slides.length)) + 'px';

    field.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";
    field.style.columnGap = gap + "px";

    slides.forEach((slide, index) => {
        slide.style.width = width;
        templates[index] = slide;
    });

    for (let i = 0; i < (perPage - 1); i++) {
        field.append(templates[i + 1].cloneNode(true));
    }

    if (indicatorsClass) {
        let indicators = document.createElement('div');
        indicators.classList.add(indicatorsClass);
        container.append(indicators);

        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('div');
            mobile ? dot.style.width = 100 / slides.length + '%' : dot.style.width = '';
            dot.setAttribute('data-slide-to', i + 1);
            dot.classList.add(`${mainClass}_dot`);
            if (i == 0) {
                dot.classList.add(`${mainClass}_active`);
            }
            indicators.append(dot);
            dots.push(dot);
        }

        let indicators_offset = container.querySelector(`.${indicatorsClass}`).getBoundingClientRect().left;
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideTo = e.target.getAttribute('data-slide-to');
                slideIndex = slideTo;
                offset = (deleteNotDigits(width) + gap) * (slideTo - 1);
                changeActivity();
                makeTimer(duration);
            });
            if (mobile) {
                dot.addEventListener('touchmove', (e) => {
                    clearInterval(timer);
                    let x = e.pageX || e.touches[0].pageX;
                    slideIndex = Math.ceil((x - indicators_offset) / deleteNotDigits(window.getComputedStyle(dot).width));
                    if (slideIndex > 0 && slideIndex <= dots.length) {
                        offset = (deleteNotDigits(width) + gap) * (slideIndex - 1);
                        changeActivity();
                        makeTimer(duration);
                    }
                });
            }
        });
    }

    makeTimer(duration);

    window.addEventListener('resize', (e) => {
        mobile = window.matchMedia('(max-width: 992px)').matches;
        mobile ? perPage = elementsPerPageMobile : perPage = elementsPerPage;
        mobile ? gap = columnGap / 2 : gap = columnGap;
        perPage == 1 ? gap = 0 : gap = gap;
        width = Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width) / perPage - (gap * (slides.length - 1) / slides.length)) + 'px';
        field.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";
        field.style.columnGap = gap + "px";

        while (field.childElementCount > baseSlides.length) {
            field.removeChild(field.lastElementChild)
        }
        for (let i = 0; i < (perPage - 1); i++) {
            field.append(templates[i + 1].cloneNode(true));
        }

        let slidesNew = document.querySelectorAll(slideSelector);
        slidesNew.forEach((slide, index) => {
            slide.style.width = width;
        });

        if (indicatorsClass) {
            let dots = document.querySelectorAll(`.${mainClass}_dot`);
            dots.forEach((dot) => {
                mobile ? dot.style.width = 100 / slides.length + '%' : dot.style.width = '';
            });
        }

        slideIndex = 1,
            offset = 0,
            changeActivity();
        onSwipe();
    });

    if (nextSlideSelector) {
        next.addEventListener("click", () => {
            moveNext();
            makeTimer(duration);
        });
    }

    if (prevSlideSelector) {
        prev.addEventListener("click", () => {
            movePrev();
            makeTimer(duration);
        });
    }

    function moveNext() {
        field.classList.add('trans-5')
        if (offset >= (deleteNotDigits(width) + gap) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += deleteNotDigits(width) + gap;
        }

        if (slideIndex == slides.length) {
            slideIndex = 1;
            field.classList.remove('trans-5')
        } else {
            slideIndex++;
        }
        changeActivity();
    }

    function movePrev() {
        field.classList.add('trans-5')
        if (offset < deleteNotDigits(width)) {
            offset = (deleteNotDigits(width) + gap) * (slides.length - 1);
        } else {
            offset -= deleteNotDigits(width) + gap;
        }

        if (slideIndex == 1) {
            slideIndex = slides.length;
            field.classList.remove('trans-5')
        } else {
            slideIndex--;
        }
        changeActivity();
    }

    function changeActivity() {
        field.style.transform = `translateX(-${offset}px)`;
        if (indicatorsClass) {
            dots.forEach(dot => dot.classList.remove(`${mainClass}_active`));
            dots[slideIndex-1].classList.add(`${mainClass}_active`);
        }
        if (containerSelector.includes('gallery')) {
            let gallery_images = document.querySelectorAll('.gallery_slide .pc')
            let new_src = gallery_images[slideIndex - 1].getAttribute('src');
            let main_image = document.querySelector('.gallery_image img');
            main_image.setAttribute('src', new_src);
        }
        if (currentCounter) {
            current.textContent = slideIndex;
        }
    }

    function makeTimer(duration){
        if (duration == 0) {
            return;
        }
        clearInterval(timer);
        timer = setInterval(moveNext, duration);
    }

    function deleteNotDigits(str) {
        return +str.replace(/[^\d\.]/g, '');
    }

    const start = (e) => {
        startX = e.pageX || e.touches[0].pageX;
    }

    const end = () => {
        let distance = 20;
        if (endX < startX && Math.abs(startX - endX) > distance) {
            moveNext();
            makeTimer(duration);
        }
        if (endX > startX && Math.abs(endX - startX) > distance) {
            movePrev();
            makeTimer(duration);
        }
    }

    const move = (e) => {
        endX = e.pageX || e.touches[0].pageX;
    }

    onSwipe()

    function onSwipe() {
        field.addEventListener('mousedown', start);
        field.addEventListener('touchstart', start, {passive: true});

        field.addEventListener('mousemove', move);
        field.addEventListener('touchmove', move, {passive: true});

        field.addEventListener('mouseup', end);
        field.addEventListener('touchend', end);

        if (!swipe || !mobile) {
            field.removeEventListener('mousedown', start);
            field.removeEventListener('touchstart', start, {passive: true});

            field.removeEventListener('mousemove', move);
            field.removeEventListener('touchmove', move, {passive: true});

            field.removeEventListener('mouseup', end);
            field.removeEventListener('touchend', end);
        }
    }
}

function openModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function modal(triggerSelector, closeSelector, modalSelector) {
    const modalTrigger = document.querySelectorAll(triggerSelector),
        modal = document.querySelector(modalSelector);
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector));
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute(closeSelector) == '') {
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });
}

if (document.querySelector('.survey') != null) {
    modal('[data-survey]', 'data-close', '.survey');
}

if (document.querySelector('.gallery_field') != null) {
    slider({
        containerSelector: '.gallery_image',
        slideSelector: '.gallery_slide',
        nextSlideSelector: '.gallery_next',
        prevSlideSelector: '.gallery_prev',
        wrapperSelector: '.gallery_wrapper',
        fieldSelector: '.gallery_field',
        indicatorsClass: 'gallery_indicators',
        elementsPerPage: 3,
        elementsPerPageMobile: 1,
        columnGap: 10,
        duration: 3000,
        swipe: true,
    });
}

if (document.querySelector('.consult') != null) {
    modal('[data-consult]', 'data-close', '.consult');
    modal('[data-thanks]', 'data-close', '.thanks');
}
if (document.querySelector('.team') != null) {
    modal('[data-team]', 'data-close', '.team');
    modal('[data-thanks]', 'data-close', '.thanks');
}

const survey_buttons = document.querySelectorAll('.button.next, .button_back');

survey_buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        let next;
        let filled = false;
        let error = button.closest('.survey_wrapper').querySelector('.survey_error');

        if (button.classList.contains('next')) {
            let inputs = e.target.closest('.survey_wrapper').querySelectorAll('input');
            inputs.forEach(input => {
                if (input.type == 'radio' || input.type == 'checkbox') {
                    if (input.checked) {
                        filled = true;
                    }
                }
                if (input.type == 'number') {
                    if (input.value != '') {
                        filled = true;
                    }
                }
            });
            if (!filled) {
                error.classList.add('flex');
                setTimeout(() => error.classList.remove('flex'), 2000);
            }
        } else {
            error.classList.remove('flex');
        }

        if ((button.classList.contains('next') && filled) || button.classList.contains('button_back')) {
            if (e.target.textContent) {
                next = e.target.getAttribute('data-show');
                e.target.parentElement.parentElement.parentElement.style.display = 'none';
            } else {
                next = e.target.closest('button').getAttribute('data-show');
                e.target.closest('button').parentElement.parentElement.parentElement.style.display = 'none';
            }
            if (next.includes('2-1')) {
                let radios = document.querySelectorAll('input[name="type"]');
                for (let radio of radios) {
                    if (radio.checked && radio.value == 'Химчистка') {
                        next = next.slice(0, -1) + '2';
                        document.getElementById('place').textContent = '';
                    } else {
                        document.getElementById('place').textContent = 'помещения ';
                    }
                }
            }
            if (next.includes('3-1')) {
                let radios = document.querySelectorAll('input[name="material"]');
                for (let radio of radios) {
                    if (radio.checked && radio.value == 'Мягкая мебель') {
                        next = next.slice(0, -1) + '2';
                    }
                }
            }

            if (error) {
                error.classList.remove('flex');
            }
            document.querySelector(`#${next}`).style.display = 'flex';
        }
    });
});

$("form").submit(function (event) {
    event.preventDefault();
    let name = event.target.classList.value.slice(0, -5);
    let formData = new FormData(document.querySelector(`.${name}_form`));
    sendPhp(name, formData);
});

function sendPhp(name, data) {
    $.ajax({
        url: `./php/send_${name}.php`,
        type: 'POST',
        cache: false,
        data: data,
        dataType: 'html',
        processData: false,
        contentType: false,
        success: function (data) {
            $(`.${name}_form`).trigger('reset');
            if (name == 'survey' || name == 'consult' || name == 'team') {
                closeModal(`.${name}`)
            }
            openModal('.thanks');
            setTimeout(function(){
                closeModal('.thanks');
            }, 6000)
        }
    });
}


function openCity(cityName) {
    let i;
    let x = document.getElementsByClassName("city");
    let y = cityName.length
    document.getElementById('services1').classList.add('button_green1');
    document.getElementById('services2').classList.add('button_green1');
    for (i = 0; i < x.length; i++) {

        x[i].style.display = "none";
        if(y>5){
            document.getElementById('services1').classList.remove('button_green1');
        }
        else {
            document.getElementById('services2').classList.remove('button_green1');
        }
    }
    document.getElementById(cityName).style.display = "block";
}

function openCity2(evt, cityName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("city1");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("bntGreen", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " bntGreen";
}



const prev = document.querySelector('.slider-control.left-arrow');
const next = document.querySelector('.slider-control.right-arrow');
const sliderItems = document.querySelector('.slider-items');
const sliderItem = document.querySelector('.slider-item');

// [...sliderItems.children].forEach(item=>item.style.transition = '200ms ease-out transform');

let currentSlide = 1;

next.addEventListener("click", () => {
    // if (sliderItems.children[currentSlide%sliderItems.children.length].classList.contains('first-item')) currentSlide=1; //xnj
    [...sliderItems.children].forEach((item, index, arr) => {
        const move = (index < currentSlide%arr.length ? sliderItem.clientWidth*arr.length : 0) + -sliderItem.clientWidth*(currentSlide%arr.length);
        item.style.transition = /* чтото чтобы двигались только видимые элементы */ false  ? 'none':'200ms ease-out transform';
        item.style.transform = `translateX(${move}px)`;
        //item.scrollBy({ left:move, behavior: "smooth" });
    })

    currentSlide++;

});
prev.addEventListener("click", () => {
    if (currentSlide <= 1 ) return; //что-то сделат ьчтобы изначально не листало влево но при возвращении доилстывало до начала
    [...sliderItems.children].forEach((item,index, arr) => {
            const move = (index < currentSlide%arr.length ? sliderItem.clientWidth*arr.length : 0) + -sliderItem.clientWidth*(currentSlide%arr.length);
            item.style.transform = `translateX(${move}px)`;
            item.scrollBy({ left:-move, behavior: "smooth" });
        }
    );
    currentSlide--;

});

