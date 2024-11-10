$(document).ready(function () {

	// check to see if we're returning for errors, and show files that are already uploaded.
	$('.sfUploaded').each(function () {
		if ($(this).val() != '') {
			$(this).siblings('div.uploadfield').hide();
			$(this).show();
		}
	});

	$('.sfSubmit').click(function (event) {
		event.preventDefault();
		var submitValue = $(this)[0].value;
		$form = $(this).parents('form'); //get the parent form.
		$field = $form.find('.sfTuringField'); //check if the form is turing.
		$el = $('<input type="hidden" name="submitButton" value="' + submitValue + '" />');
		$form.append($el[0]);

		if ($field.length > 0) { //recaptcha is enabled.
			grecaptcha.execute(recaptchaSiteKey, { action: 'formpost' }).then(function (token) {
				$field[0].value = token;

				setTimeout(function () { $form[0].submit(); }, 100);

			});
		} else { //no recaptcha
			$form[0].submit();
		}
	});

	$('input.sfUpload').click(function (e) {
		let filebox = $(this).siblings('input.fileupload');
		let parentdiv = $(this).parent();
		let uploadeddiv = $(this).parent().siblings('input.sfUploaded');
		let uploadedid = $(this).parent().siblings('input.sfUploaded').attr('id');

		$('#tempdata').val(uploadedid);
		let file = filebox[0].files[0];
		let filename = filebox.val().split('\\').pop();
		if (filename == '') return;

		var ajaxData = new FormData();
		ajaxData.append(filename, file);
		$.ajax({
			url: '/govofficeservices/api/sf/sfupload.ashx',
			type: 'POST',
			method: 'POST',
			data: ajaxData,
			cache: false,
			contentType: false,
			processData: false,
			crossDomain: true,
			timeout: 300000,
			beforeSend: function () {
				$('#' + uploadedid + '_spin').css("visibility", "visible");
			},
			success: function (data) {
				let id = $('#tempdata').val();
				if (data.status == 'ok') {
					$('#' + id).val(data.file);
					$('#' + id).siblings('div.uploadfield').hide();
					$('#' + id).show();
					console.log('file uploaded: ' + data.file);
				}
				else if (data.status == 'error') {
					$('#' + id + '_err').html('failed to upload file: ' + data.message);
					console.log('failed to upload file: ' + data.message);
				}
				$('#' + id + '_spin').css("visibility", "hidden");
			},
			error: function(xhr, ajaxOptions, thrownError) {
				if (thrownError == 'abort' || thrownError == 'undefined') return;
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			},
			complete: function () {
				let id = $('#tempdata').val();
				$('#' + id + '_spin').css("visibility", "hidden");
			}
		});
	});
});

