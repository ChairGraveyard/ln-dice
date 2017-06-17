(function () {

	diceapp.controller("UserCtrl", ["$rootScope", "$scope", "$timeout", "$uibModal", "dice", "config", controller]);

	function controller($rootScope, $scope, $timeout, $uibModal, dice, config) {

		var $ctrl = this;

		$scope.spinner = 0;
		$scope.nextRefresh = null;

		$scope.refresh = function () {
			$scope.spinner++;
			$scope.updateNextRefresh();
			dice.getUser(false).then(function (response) {
				$scope.spinner--;
				console.log(response);
				$rootScope.$broadcast(config.events.USER_REFRESHED, response.data);
				$scope.data = JSON.stringify(response.data, null, "\t");
				$scope.info = response.data;
			}, function (err) {
				$scope.spinner--;
				console.log("Error:", err);
				dice.alert(err.message || err.statusText);
			});
		};

		$scope.updateNextRefresh = function () {
			$timeout.cancel($scope.nextRefresh);
			$scope.nextRefresh = $timeout($scope.refresh,
				dice.getConfigValue(config.keys.AUTO_REFRESH, config.defaults.AUTO_REFRESH));
		};

		$scope.generateInvoice = function () {

			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: "addinvoice-modal-title",
				ariaDescribedBy: "addinvoice-modal-body",
				templateUrl: "templates/partials/dice/addinvoice.html",
				controller: "ModalAddInvoiceCtrl",
				controllerAs: "$ctrl",
				size: "lg",
				resolve: {
					defaults: function () {
						return {
							value: "1000"
						};
					}
				}
			});

			modalInstance.rendered.then(function () {
				$("#addinvoice-value").focus();
			});

			modalInstance.result.then(function (values) {
				console.log("values", values);
				$scope.refresh();
			}, function () {
				console.log("Modal dismissed at: " + new Date());
			});

		};

		$scope.withdrawFunds = function () {

			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: "withdrawfunds-modal-title",
				ariaDescribedBy: "withdrawfunds-modal-body",
				templateUrl: "templates/partials/dice/withdrawfunds.html",
				controller: "ModalWithdrawFundsCtrl",
				controllerAs: "$ctrl",
				size: "lg",
				resolve: {
					defaults: function () {
						return {
							payreq: ""
						};
					}
				}
			});

			modalInstance.rendered.then(function () {
				$("#withdrawfunds-payreq").focus();
			});

			modalInstance.result.then(function (values) {
				console.log("values", values);
				$scope.refresh();
			}, function () {
				console.log("Modal dismissed at: " + new Date());
			});

		};

		$scope.$on(config.events.USER_REFRESH, function (event, args) {
			console.log("Received event USER_REFRESH", event, args);
			$scope.refresh();
		});

		$scope.refresh();
	}

})();
