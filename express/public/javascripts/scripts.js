
$(function() {
  // Toggle edit and delete links when task is clicked.
  $('.task-body').click(function() {
    let current = $(this);
    current.find('.btn').click(event => event.stopPropagation());
    current.find('.task-footer').slideToggle(100, function() {
      current.parent('.task').toggleClass('open');
    });
  });

  // Hide/Show the add task form.
  $('#open-form').click(function() {
    $('body').toggleClass('form-open');
    let position = $('body').hasClass('form-open') ? '0' : '-210px';
    $('#new-task-form').animate({bottom: position}, 300, function() {
      let buttonIcon = $('#open-form').html();
      buttonIcon = buttonIcon == '+' ? '-' : '+';
      $('#open-form').text(buttonIcon);
    });
  })
});
