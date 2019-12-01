$(function() {
  $("#addLivestockButton").on("click", function() {
    $.ajax({
      url: "/add_Livestock",
      data: $("#newLivestockRecord").serialize(),
      type: "POST",
      success: function(response) {
        $("#input_born_date").val("");
        $("#input_sub_type").val("");
        $("#input_health").val("");
        $("#input_notes").val("");
        $("#input_weight").val("");
        $("#input_market_date").val("");
        $("#input_goal_price").val("");
        $("#input_sale_price").val("");
        $("#input_location").val("");
        window.location.reload();
      }
    });
  });
});

function deleteLiverstockRecord(val) {
  $.ajax({
    url: "/deleteLiverstockRecord/" + val,
    type: "POST",
    success: function(response) {
      window.location.reload();
    }
  });
}
