'use strict';

const Service = require('./Service');
const Role = require('./Role');
const Organisation = require('./Organisation');
const ServiceUser = require('./ServiceUser');

const services = [
  new Service({
    id: '0a0410ba-f896-4c2b-aa08-6337a0d3db2x',
    name: 'Academisation and free schools self service',
    description: 'Bacon ipsum dolor amet ipsum irure ball tip pariatur hamburger, adipisicing dolor frankfurter bacon bresaola capicola drumstick. Corned beef fugiat andouille irure porchetta. Meatball veniam hamburger ham hock bacon cillum t-bone adipisicing eiusmod tenderloin burgdoggen officia. Chuck boudin excepteur proident. Biltong andouille drumstick, aliquip ground round ribeye exercitation ut consectetur esse consequat. Ribeye elit ground round ea cupidatat ad.',
  }),
  new Service({
    id: '0a0410ba-f896-4c2b-aa08-6337a0d3db2e',
    name: 'Analyse School Performance',
    description: 'Enables controlled school users to download their own pupil performance data allowing for the monitoring of progress at pupil level. The site also hosts the Ofsted Inspection Dashboard.',
  }),
  new Service({
    id: '5e1a882f-4bd3-4d12-8e40-d22908ef16de',
    name: 'Application for consent to acquire or take lease of land or buildings or enter a joint use agreement',
    description: 'Disrupt jean shorts viral hella meh, plaid cupidatat magna art party. Echo Park adipisicing literally narwhal. Williamsburg leggings church-key, craft beer forage cornhole jean shorts blue bottle pariatur. Officia sapiente bespoke, locavore plaid cray voluptate deep v ex vinyl tote bag chillwave swag occaecat. Sed banh mi 3 wolf moon single-origin coffee quis tempor. Hoodie pitchfork pork belly aliqua, shabby chic elit consequat freegan ethical try-hard mixtape. Schlitz banjo deep v ullamco blog, umami nulla sint elit skateboard Godard odio.',
  }),
  new Service({
    id: 'c3313ac0-669b-4016-9ca5-8b3d78f383c9',
    name: 'Budget Forecast Return',
    description: 'Chuck ipsum. Multiple people have died from Chuck Norris giving them the finger. Chuck Norris doesn’t need to swallow when eating food. Crop circles are Chuck Norris\' way of telling the world that sometimes corn needs to lie the down. Chuck Norris ordered a Big Mac at Burger King, and got one.',
  }),
  new Service({
    id: '7183ddd3-0b09-4c64-9612-b677fe8c1a44',
    name: 'Case Worker',
    description: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.',
  }),
  new Service({
    id: '752a819c-cf21-40cb-9f45-2564ea88a2ea',
    name: 'CDC School System',
    description: 'Bonbon brownie tootsie roll chocolate jelly-o caramels icing tiramisu. Toffee cheesecake muffin dragée gummies topping chocolate dessert. Bear claw jelly apple pie.',
  }),
  new Service({
    id: '4d46ed12-c4a9-462b-8c33-f323e5f4c4f9',
    name: 'COLLECT',
    description: 'Parrel schooner execution dock careen gun nipper salmagundi lee interloper black spot skysail transom Pieces of Eight lugsail strike colors rum stern Brethren of the Coast reef chase.',
  }),
];

const getAvailableServicesForUser = () => Promise.resolve([
  new Service({
    id: 'c3313ac0-669b-4016-9ca5-8b3d78f383c9',
    name: 'Budget Forecast Return',
    description: 'Chuck ipsum. Multiple people have died from Chuck Norris giving them the finger. Chuck Norris doesn’t need to swallow when eating food. Crop circles are Chuck Norris\' way of telling the world that sometimes corn needs to lie the down. Chuck Norris ordered a Big Mac at Burger King, and got one.',
  }),
  new Service({
    id: '7183ddd3-0b09-4c64-9612-b677fe8c1a44',
    name: 'Case Worker',
    description: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.',
  }),
  new Service({
    id: '752a819c-cf21-40cb-9f45-2564ea88a2ea',
    name: 'CDC School System',
    description: 'Bonbon brownie tootsie roll chocolate jelly-o caramels icing tiramisu. Toffee cheesecake muffin dragée gummies topping chocolate dessert. Bear claw jelly apple pie.',
  }),
]);
const getServicesForUser = () =>
    Promise.resolve([
      new Service({
        id: '4d46ed12-c4a9-462b-8c33-f323e5f4c4f9',
        name: 'COLLECT',
        description: 'Parrel schooner execution dock careen gun nipper salmagundi lee interloper black spot skysail transom Pieces of Eight lugsail strike colors rum stern Brethren of the Coast reef chase.',
        organisation: new Organisation({
          id: 1,
          name: 'St Patricks Primary School',
        }),
        role: new Role({
          id: 1,
          name: 'Approver',
        }),

      }),
      new Service({
        id: '0a0410ba-f896-4c2b-aa08-6337a0d3db2e',
        name: 'Analyse School Performance',
        description: 'Enables controlled school users to download their own pupil performance data allowing for the monitoring of progress at pupil level. The site also hosts the Ofsted Inspection Dashboard.',
        organisation: new Organisation({
          id: 1,
          name: 'St Patricks Primary School',
        }),
        role: new Role({
          id: 0,
          name: 'End User',
        }),
      }),
      new Service({
        id: '0a0410ba-f896-4c2b-aa08-6337a0d3db2e',
        name: 'Analyse School Performance',
        description: 'Enables controlled school users to download their own pupil performance data allowing for the monitoring of progress at pupil level. The site also hosts the Ofsted Inspection Dashboard.',
        organisation: new Organisation({
          id: 2,
          name: 'George Fentham Endowed Primary School',
        }),
        role: new Role({
          id: 0,
          name: 'End User',
        }),
      }),
    ])
  // organisation: new Organisation(),
  // userService: new UserService(),


;

const getServiceDetails = async (organisationId, serviceId) => {
  const organisation = new Organisation({
    id: 2,
    name: 'George Fentham Endowed Primary School',
  });
  const service = services.find(item => item.id === serviceId);
  service.organisation = organisation;
  return Promise.resolve(service);
};

const getServiceUsers = async () => {
  const organisation = new Organisation({
    id: 2,
    name: 'George Fentham Endowed Primary School',
  });
  return Promise.resolve(
    [
      new ServiceUser({
        id: '6cb83f92-980f-4782-aa81-b63334dae995',
        role: { id: 999, name: 'Approver' },
        organisation
      }),
      new ServiceUser({
        id: 'aa3c5dac-f53c-4db6-a3df-ff1339434c74',
        role: { id: 999, name: 'Approver' },
        organisation
      }),
      new ServiceUser({ id: '63401a04-745c-46fc-bdaf-2147ba71d214', role: { id: 0, name: 'End user' }, organisation }),
      new ServiceUser({ id: '86ee7a5f-1c2e-4edf-9812-7fa867cce122', role: { id: 0, name: 'End user' }, organisation }),
    ]);
};

const getUserServiceRequest = async () => {
  const organisation = new Organisation({
    id: 2,
    name: 'George Fentham Endowed Primary School',
  });
  return Promise.resolve(new ServiceUser({
    id: '6cb83f92-980f-4782-aa81-b63334dae995',
    role: { id: 999, name: 'Approver' },
    organisation
  }));
};

const migrateInvitationServicesToUserServices = async (invitationId, userId) => {
  return Promise.resolve();
};

const searchOrganisations = async (criteria, page) => {
  return Promise.resolve({
    organisations: [],
    page: 0,
    totalNumberOfPages: 0,
    totalNumberOfRecords: 0,
  });
};


module.exports = {
  getServicesForUser,
  getAvailableServicesForUser,
  getServiceDetails,
  getServiceUsers,
  getUserServiceRequest,
  migrateInvitationServicesToUserServices,
  searchOrganisations,
};
