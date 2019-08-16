var targets = [
    // PREGNANCIES THIS MONTH
    {
      id: 'pregnancies-this-month',
      type: 'reported',
    
      date: 'reported',
      icon: 'pregnant',
      goal: -1,
      translation_key: 'targets.pregnancies.title',
      subtitle_translation_key: 'targets.pregnancies.subtitle',
      appliesTo: 'reports',
      appliesIf: function(contact,report){
        return report.form ==="pregnancy_registration";

     },
    },
    {
        id: 'percentage-of-pregnancies',
        type: 'percent',
        date: 'now',
        icon: 'pregnant',
        goal: -1,
        translation_key: 'targets.percentage.pregnancies.title',
        subtitle_translation_key: 'targets.percentage.pregnancies.subtitle',
        appliesTo: 'contacts',
        appliesToType: ['person','clinic'],
        appliesIf: function(c){
           return c.contact.sex === "female";
        },
       passesIf: function(c){
        return c.contact.pregnant_at_registration === "true";
       },
    },

    {
        id: 'total-number-of-patients',
        type: 'count',
        date: 'now',
        icon: 'people-children',
        goal:200,
        translation_key: 'targets.people.title',
        subtitle_translation_key: 'targets.people.subtitle',
        appliesTo: 'contacts',
        appliesToType: ['person'],
        appliesIf: function(c){
            return c.contact.type ==="person" &&
            c.contact.parent &&
            c.contact.parent.parent &&
            c.contact.parent.parent.parent;
        }
    },
]