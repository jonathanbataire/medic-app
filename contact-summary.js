var cards = [];
var context = {};
var fields = [];

if (contact.type === 'person') {
  fields = [
    { label: 'patient_id', value: contact.patient_id, width: 3 },
    { label: 'contact.sex', value: contact.sex, width: 3 },
    { label: 'Notes', value: contact.notes, width: 12 },
    { label: 'contact.age', value: contact.date_of_birth, width: 4, filter: 'age' },
    { label: 'Phone Number', value: contact.phone, width: 8, filter: 'phone' },
    { label: 'contact.parent', value: lineage, filter: 'lineage' }
  ];
  var pregnancy;
  var pregnancyDate;
  context.pregnant = false;
  var today = new Date();
  //Subtract 45 weeks from today to get cutoff date for earliest possible LMP of someone who is still pregnant
  var lmp_45wks = new Date();
  lmp_45wks.setDate(today.getDate()-315);

  reports.forEach(function(report) {
    if (report.form === 'pregnancy' ) {
      var lmp = new Date(report.fields.lmp_date);

      var subsequentDeliveries = reports.filter(function(report2) {
        return report2.form === 'delivery' && report2.reported_date > report.reported_date;
      });

      if (subsequentDeliveries.length > 0 || lmp < lmp_45wks) {
        return;
      }

      var subsequentVisits = reports.filter(function(report2) {
        return report2.form === 'pregnancy_visit' && report2.reported_date > report.reported_date;
      });


      var pregnancyChecks = reports.filter(function(report2) {
        return report2.form === 'pregnancy_check' && report2.reported_date > report.reported_date;
      });

      context.pregnant = true; // don't show Create Pregnancy Report button
      var edd = report.fields.edd_8601;
      var visitReportDate = report.reported_date; 

      subsequentVisits.forEach(function(report) {
        if(report.reported_date>visitReportDate){ // only change context if we get a later report 
        
         if (report.fields.g_overview && report.fields.g_overview.pregnant )
                context.pregnant = report.fields.g_overview.pregnant!=='no'; 
         

          if(report.fields.g_overview&&report.fields.g_overview.update_edd ==='yes') {
          edd = report.fields.edd_8601; }

        }  
        visitReportDate = report.reported_date;
        return;
      });

    
    var checkReportDate = report.reported_date; 
    pregnancyChecks.forEach(function(report) {
         if(report.reported_date>checkReportDate){
          // only change context if we get a later report 
           if (report.fields.g_overview && report.fields.g_overview.pregnant )
          context.pregnant = report.fields.g_overview.pregnant!=='no'; 
          if(report.fields.g_overview && report.fields.g_overview.update_edd ==='yes') {
          edd = report.fields.edd_8601; }
        }
        checkReportDate = report.fields.reported_date;    
        
        return;
      });





      if (!pregnancy || pregnancyDate < report.reported_date) {
        pregnancyDate = report.reported_date;
        pregnancy = {
          label: 'contact.profile.pregnancy',
          fields: [
            { label: 'contact.profile.edd', value: edd, filter: 'simpleDate' },
            { label: 'contact.profile.visit', value: 'contact.profile.visits.of', translate: true, context: { count: subsequentVisits.length, total: 4 } }
          ]
        };
      }
    }

  context.childIsDead = false; 
  context.motherIsDead = false; 
  var childIsAlive =''; 
  var motherIsAlive='';

  if (report.form === 'postnatal_care' ) {


     motherIsAlive = report.fields.group_delivery_summary ===  undefined ? 'alive' : report.fields.group_delivery_summary.mother_condition;
     
     childIsAlive = report.fields.group_delivery_summary.g_pregnancy_outcome; 
    context.motherIsDead = motherIsAlive==='dead';
    context.chilsIsDead = (childIsAlive==='still_birth' || childIsAlive==='miscarriage' );

    }

  if (report.form === 'assessment' && report.fields.group_assess  ) { // check if group exists 
     childIsAlive = report.fields.group_assess.is_alive;
    context.childIsDead = childIsAlive==='no';
    }
    
  if (report.form === 'assessment_follow_up' ) {
     childIsAlive = report.fields.group_better.g_patient_better;
    context.childIsDead = childIsAlive==='died';
    }



  });

  if (pregnancy &&  context.pregnant) {
    cards.push(pregnancy);
  }
} else if (contact.type === 'clinic' || contact.type === 'health_center') {
  /*fields = [
    { label: 'contact.jonathan', value: 24, width: 6},
    { label: 'contact.bataire', value: 7, width: 6},
    { label: 'contact.parent', value: contact.parent, width: 12, filter: 'clinic' }
  ];
 var card = {
    label: 'contact.jonathan.title',
    fields: [{
            label: 'contact.jonathan.age',
            value: 37,
            width:6
        },
        {
            label: 'contact.jonathan.level',
            value: 12,
            width:6
        },
        {
            label: 'contact.jonathan.phone',
            value: '+256 789012344',
            width:12
        }
    ]
    
};
cards.push(card);*/
}

var result = {
  fields: fields,
  cards: cards,
  context: context
};

return result;
