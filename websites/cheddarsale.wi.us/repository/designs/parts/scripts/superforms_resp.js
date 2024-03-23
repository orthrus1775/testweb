function reloadCombo(formID) {
    sSuperForm = eval('document.SuperForms_' + formID);
    sSuperForm.action = sSuperForm.action + '&reload=true';
    sSuperForm.resubmit.value = 'Current';
    sSuperForm.submit();
}

$(document).ready(function() {
    valCheckboxes();
    valRadios();
    $('.sffield.checkboxes.required input').click(function () {
        valCheckboxes();
    });
    $('.sffield.radios.required input').click(function () {
        valRadios();
    });
    $('form.hidelabels div.sffield.nodefault.textbox input').keydown(function () {
        if ($(this).parent().find('label').css('opacity') == 0)
            $(this).parent().find('label').css('opacity', '1.0').height('auto');
    });
    $('form.hidelabels div.sffield.nodefault.GNAM input').keydown(function () {
        if ($(this).parent().find('label').css('opacity') == 0)
            $(this).parent().find('label').css('opacity', '1.0').height('auto');
    });
    $('form.hidelabels div.sffield.nodefault.GCSZ input').keydown(function () {
        if ($(this).parent().find('label').css('opacity') == 0)
            $(this).parent().find('label').css('opacity', '1.0').height('auto');
    });
    $('form.hidelabels div.sffield.nodefault.textarea textarea').keydown(function () {
        if ($(this).parent().find('label').css('opacity') == 0)
            $(this).parent().find('label').css('opacity', '1.0').height('auto');
    });
})
 
function valCheckboxes() {
    $('.sffield.checkboxes.required').each(function (index, value) {
        if ($(this).find('input').is(':checked')) {
            $(this).removeClass('invalid');
            $(this).find('input').removeAttr('required');
        }
        else {
            $(this).addClass('invalid');
            $(this).find('input').attr('required', 'required');
        }
    })
}
function valRadios() {
    $('.sffield.radios.required').each(function (index, value) {
        if ($(this).find('input').is(':checked')) {
            $(this).removeClass('invalid');
        }
        else {
            $(this).addClass('invalid');
        }
    })
}
