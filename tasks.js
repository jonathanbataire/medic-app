[
    {
        icon: 'pregnant',
        title: 'task.pregnancy.registration',
        appliesTo: 'contacts',
        appliesToType: [ 'person' ],
        appliesIf: function(c){
           return c.contact.pregnant_at_registration ==="true";

        },
        actions: [ { form: 'pregnancy_registration' } ],
        resolvedIf: function(c, r, event, dueDate){
            return Utils.isFormSubmittedInWindow(c.reports, 'pregnancy_registration', dueDate, Utils.addDate(dueDate, event.end + 1).getTime());

        },
        events: [
          {
            days:0, start:0, end:7,
          }
        ]
      }
]