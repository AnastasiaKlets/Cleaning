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
            closeModal(`.${name}`)
        }
    });
}
