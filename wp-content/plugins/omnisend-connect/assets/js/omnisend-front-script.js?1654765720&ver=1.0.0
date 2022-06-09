/*
omnisend_woo_data - object is created by WP, check following properties bellow
	ajax_url
 */
var omnisend_email_submitted = '';
var omnisend_email_submit_in_progress = false;

function omnisend_pp_push(variantID) {
	if (jQuery('input[name=variation_id]').length) {
		var selectedVariant = jQuery('input[name=variation_id]').val();
		if (selectedVariant > 0) variantID = selectedVariant;
	}

	if (Object.prototype.toString.call("omnisend_product") === '[object String]' && typeof omnisend_product !== 'undefined') {
		window.omnisend = window.omnisend || [];
		try {
			variantID = omnisend_product["variants"][variantID]["variantID"];
		} catch (err) {
			if (omnisend_product.hasOwnProperty('variants')) {
				for (var p in omnisend_product["variants"])
					if (omnisend_product["variants"].hasOwnProperty(p)) {
						variantID = omnisend_product["variants"][p]["variantID"];
						break;
					};
			} else return;
		}
		try {
			var data = {
				$productID: omnisend_product["productID"],
				$variantID: omnisend_product["variants"][variantID]["variantID"],
				$currency: omnisend_product["currency"],
				$price: omnisend_product["variants"][variantID]["price"],
				$title: omnisend_product["title"],
				$description: omnisend_product["description"],
				$imageUrl: omnisend_product["variants"][variantID]["imageUrl"],
				$productUrl: omnisend_product["productUrl"]
			};
			if (typeof omnisend_product["variants"][variantID]["oldPrice"] !== "undefined") {
				data["$oldPrice"] = omnisend_product["variants"][variantID]["oldPrice"];
			}
			omnisend.push(["track", "$productViewed", data]);
		} catch (err) {}
	}
}

jQuery(document).ready(function () {
	if (jQuery('input[name=variation_id]').length) {
		jQuery('input[name=variation_id]').change(function () {
			if (jQuery(this).val() != "") omnisend_pp_push(jQuery(this).val());
		});
	}

	['#billing_email', '#username', '#reg_email'].forEach(function (selector) {
		var emailInput = document.querySelector(selector);
		if (emailInput) {
			emailInput.addEventListener('focus', function () { omnisend_handle_email_change(selector, 'focus') })
			emailInput.addEventListener('change', function () { omnisend_handle_email_change(selector, 'change') })
		}
	})
});

function omnisend_handle_email_change(selector, eventName) {
	if (omnisend_email_submit_in_progress) {
		return;
	}

	omnisend_email_submit_in_progress = true;

	var email = document.querySelector(selector).value;

	var validEmail = function (email) {
		return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
	}

	if (!validEmail(email)) {
		omnisend_email_submit_in_progress = false;
		return;
	}

	if (omnisend_email_submitted === email) {
		omnisend_email_submit_in_progress = false;
		return;
	}

	var url = omnisend_woo_data.ajax_url + "?action=omnisend_identify&email=" + email;
	var xmlHttpRequest = new XMLHttpRequest;
	xmlHttpRequest.open("POST", url, true);
	xmlHttpRequest.onload = function () {
		var successful = xmlHttpRequest.status >= 200 && xmlHttpRequest.status < 400;
		var msg = successful ? "omnisend_handle_email_change request success" : "omnisend_handle_email_change request error";
		if (successful) {
			omnisend_email_submitted = email;
		}
		console.log(msg, xmlHttpRequest.responseText);
		omnisend_email_submit_in_progress = false;
	};
	xmlHttpRequest.onerror = function () {
		console.log("omnisend_handle_email_change request error", xmlHttpRequest.responseText)
		omnisend_email_submit_in_progress = false;
	};
	xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
	xmlHttpRequest.setRequestHeader("Accept", "application/json");
	xmlHttpRequest.send();
}
