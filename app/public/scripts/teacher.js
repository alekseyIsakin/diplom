let tmp = -1
document.cookie.split(';')
    .some((el, index) => {
        const v = el.split('=')
        if (v[0].endsWith('user_id')) {
            tmp = Number(v[1])
            return true
        }
    })

const user_id = tmp;

$(function () {
    $('#submit').submit(function (event) {
        event.preventDefault(); // Stops browser from navigating away from page
        const g_option = $('.selected')[0]
        const title = $('#class_name')[0].value
        const date = $('#date_time')[0].value
        const week_cnt = Number($('.week_cnt:checked')[0].value)

        if (g_option === undefined ||
            title == '' ||
            date == '') { alert('неверно заполнены поля'); return }

        // build a json object or do something with the form, store in data
        let data = {
            start: Date.parse(date) / (60 * 1000),
            duration: $('#duration')[0].value,
            group_id: g_option.getAttribute('group_id'),
            class_id: g_option.getAttribute('class_id'),
            week_cnt: week_cnt
        }


        $.ajax({
            type: 'POST',
            url: '/db/shedule',
            data: data,
            success: function (resp) {
                alert(JSON.stringify(resp));
            },
            error: function (err) {
                alert('error' + JSON.stringify(err));
            }
        });
    });
});

const fetch_groups = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/db/groups',
            headers: { "Content-Type": "application/json" },
            success: (response) => resolve(response),
            error: (error) => reject(error)
        });
    })
}
const fetch_teacher_classes = (teacher_id, class_title) => {
    return new Promise((resolve, reject) => {
        $.ajax(
            {
                type: 'GET',
                url: '/db/classes',
                data: { teacher_id: teacher_id, class_title: class_title },
                headers: { "Content-Type": "application/json" },
                success: (response) => resolve(response),
                error: (error) => reject(error)
            });
    })
}
const delete_teacher_class = (classes_id) => {
    return new Promise((resolve, reject) => {
        $.ajax(
            {
                type: 'DELETE',
                url: '/db/classes',
                data: { classes_id: classes_id },
                success: (response) => resolve(response),
                error: (error) => reject(error)
            });
    })
}
const push_new_class = (data) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: '/db/classes',
            data: data,
            success: (response) => resolve(response),
            error: (error) => reject(error)
        })
    })
}

const load_new_class = (el) => {
    console.log(JSON.stringify(el))
    const one_class_holder = document.createElement('div')
    const one_class = document.createElement('div')
    const class_title = document.createElement('label')
    const group_title = document.createElement('label')
    const del_btn = document.createElement('button')

    class_title.textContent = 'Class: ' + el.class_title
    group_title.textContent = 'Group: ' + el.group_title
    del_btn.textContent = 'Пометить для удаления'

    del_btn.setAttribute('type', 'button')
    del_btn.addEventListener('click', (e) => {
        if (one_class_holder.classList.contains('to_delete'))
            del_btn.textContent = 'Пометить для удаления'
        else
            del_btn.textContent = 'Вернуть'

        one_class_holder.classList.toggle('to_delete')
        if (one_class.classList.contains('selected'))
            one_class.click()

    })

    one_class.appendChild(class_title)
    one_class.appendChild(group_title)
    one_class_holder.appendChild(one_class)
    one_class_holder.appendChild(del_btn)

    one_class.classList.add('one_class')
    one_class.setAttribute('class_id', el.class_id)
    one_class.setAttribute('group_id', el.group_id)
    one_class.setAttribute('class_title', el.class_title)
    one_class.setAttribute('group_title', el.group_title)

    one_class.addEventListener('click', (e) => {
        const group_title = $('#group_name')[0]
        const class_name = $('#class_name')[0]
        const is_selected = one_class.classList.contains('selected')
        const to_delete = one_class_holder.classList.contains('to_delete')

        if (is_selected || to_delete) {
            $('.one_class').removeClass('selected')
            class_name.textContent = ""
            group_title.textContent = ""
            return
        }
        $('.one_class').removeClass('selected')

        one_class.classList.add('selected')
        class_name.textContent = one_class.getAttribute('class_title')
        group_title.textContent = one_class.getAttribute('group_title')
    })

    $('#class_holder').append(one_class_holder)
}

const create_new_class = () => {
    const data = {
        class_title: $('#new_class_title')[0].value,
        group_id: $('#group_id_for_new').find("option:selected")[0].value
    }

    if (data.title == '' || isNaN(data.group_id)) {
        alert('Неверно заполнены поля')
        return
    }
    push_new_class(data).then(resp => {
        $('#class_holder').empty()
        fetch_teacher_classes(user_id)
            .then(res => res.forEach(load_new_class))
            .catch(err => alert('cant create new class'))
    })
}

const delete_marked = () => {
    const to_delete_ids = []

    $('.to_delete > .one_class')
        .each(function (el) {
            to_delete_ids.push($(this)[0].getAttribute('class_id'))
        })
    if (to_delete_ids.length == 0) return
    delete_teacher_class(to_delete_ids)
        .then(() => {
            $('#class_holder').empty()
            fetch_teacher_classes(user_id)
                .then(res => res.forEach(load_new_class))
        })
        .catch(err => alert('cant delete classes'))
}

$(function (e) {
    fetch_teacher_classes(user_id)
        .then(res => res.forEach(load_new_class))

    fetch_groups()
        .then(res => {
            res.forEach(el => {
                $('.group_holder').append(`<option value=${el.id} id=group_${el.id}>${el.group_title}</option>`)
            });

        })

    $('#new_class').on('click', () => {
        create_new_class()
    })
    $('#delete_classes').on('click', () => {
        delete_marked()
    })

    const delay = 15 * 60 * 1000
    let dt = new Date(Date.now() - (new Date).getTimezoneOffset() * 60 * 1000 + delay)
    dt = dt.toISOString().split('.')[0].split(':').slice(0, 2).join(':')
    console.log(dt)
    // $('#date_time').attr('min', dt)
    $('#date_time').attr('value', dt)
})