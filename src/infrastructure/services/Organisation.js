class Organisation {
  constructor({ id, name, category, type, urn, uid, ukprn, establishmentNumber, status, closedOn, address }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.type = type;
    this.urn = urn;
    this.uid = uid;
    this.ukprn = ukprn;
    this.establishmentNumber = establishmentNumber;
    this.status = status;
    this.closedOn = closedOn;
    this.address = address;
  }
}

module.exports = Organisation;
