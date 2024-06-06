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
        
        if (e.target.textContent) {
            next = e.target.getAttribute('data-show');
            e.target.parentElement.parentElement.parentElement.style.display = 'none';
        } else {
            next = e.target.closest('button').getAttribute('data-show');
            e.target.closest('button').parentElement.parentElement.parentElement.style.display = 'none';
        }
        if (next.includes('2-1') && button.classList.contains('next')) {
            let radios = document.querySelectorAll('input[name="type"]');
            for (let radio of radios) {
                if (radio.checked && radio.value == 'Химчистка') {
                    next = next.slice(0, -1) + '2';
                }
            }
        }
        
        document.querySelector(`#${next}`).style.display = 'flex';
    });
});
