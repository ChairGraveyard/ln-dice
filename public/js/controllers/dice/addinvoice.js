module.exports = function ($scope, $uibModalInstance, defaults, dice) {

	var $ctrl = this;

	$ctrl.spinner = 0;

	$ctrl.values = defaults;

	$ctrl.ok = function () {
		$ctrl.spinner++;
		dice.addInvoice($ctrl.values.memo, $ctrl.values.value).then(function (response) {
			$ctrl.spinner--;
			console.log("AddInvoice", response);
			if (response.data.error) {
				if ($ctrl.isClosed) {
					dice.alert(response.data.error);
				} else {
					$ctrl.warning = response.data.error;
				}
			} else {
				$ctrl.invoice = response.data.payment_request;
			}
		}, function (err) {
			$ctrl.spinner--;
			console.log(err);
			var errmsg = err.message || err.statusText;
			if ($ctrl.isClosed) {
				dice.alert(errmsg);
			} else {
				$ctrl.warning = errmsg;
			}
		});
	};

	$ctrl.cancel = function () {
		$uibModalInstance.dismiss("cancel");
	};

	$ctrl.dismissAlert = function () {
		$ctrl.warning = null;
	};

	$scope.$on("modal.closing", function (event, reason, closed) {
		console.log("modal.closing: " + (closed ? "close" : "dismiss") + "(" + reason + ")");
		$ctrl.isClosed = true;
	});

};
