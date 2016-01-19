var STUDAPP = STUDAPP || {};

STUDAPP.Navigation = Class.create({
// ----------------------------------------------
    initialize: function () {
        this.render();
        this.initHandler();
    },
    render: function (data) {
        var markup = '<a href="#" data-action="studiengangList">Studiengänge</a> ' +
            '<a href="#" data-action="modulList">Module</a>';
        $('#idNav').html(markup);
    },
    initHandler: function () {
        $("#idNav").on("click", "a", function (event) {
            var action = $(event.target).attr('data-action');
            STUDAPP.eventService.publish_px('app', [action, null]);
            event.stopPropagation();
            event.preventDefault();
        });
    }
});
