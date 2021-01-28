class Application {
  static init() {
      const ci = new ComponentInterface();
  }
}

class Component {}

class Button extends Component {
  _btn;
  constructor(type, value) {
    super();
    this._btn = document.createElement('input');
    this._btn.setAttribute('type', type);
    this._btn.setAttribute('value', value);
  }
}

class Header extends Component {
  constructor() {
    super();
    const btnAdd = new Button('button', 'Add');
    document.querySelector('#header').append(btnAdd._btn);
  }
}

class ManipulationInterface extends Component {
  createInterface() {
    const container = document.querySelector('.manipCont');
    const btnSubmit = new Button('submit', 'Submit');
    const inputName = {
      txtEmpName: 'Name',
      txtEmpAge: 'Age',
      txtEmpAddr: 'Address',
      txtEmpExp: 'Experience',
      txtEmpPhoneNum: 'Phone Number',
      txtEmpEmail: 'Email',
      txtEmpEmplDate: 'Employment Date',
    };
    const head = document.createElement('p');
    head.textContent = 'Add employee';
    head.classList.toggle('header');
    container.append(head);
    for (const key in inputName) {
      if (inputName.hasOwnProperty(key)) {
        const label = document.createElement('label');
        const input = document.createElement('input');
        const br = document.createElement('br');
        label.setAttribute('for', key);
        label.textContent = `${inputName[key]}`;
        input.setAttribute('type', 'text');
        input.setAttribute('id', key);
        input.setAttribute('name', key);
        container.append(label, br, input);
        container.innerHTML = container.innerHTML + '<br><br>';
      }
    }
    container.append(btnSubmit._btn);
  }

  renderInterface() {
    const backdrop = document.querySelector('.backdrop');
    const container = document.querySelector('.manipCont');
    backdrop.classList.toggle('visible');
    container.classList.toggle('visible');
    backdrop.addEventListener('click', this.closeInterface.bind(this));
    const x = window.innerWidth / 2 - container.clientWidth / 2;
    const y = window.innerHeight / 2 - container.clientHeight / 2;
    container.style.position = 'absolute';
    container.style.left = x + 'px';
    container.style.top = y + 'px';
  }

  closeInterface() {
    const backdrop = document.querySelector('.backdrop');
    const container = document.querySelector('.manipCont');
    backdrop.classList.toggle('visible');
    container.classList.toggle('visible');
  }
}

class Table extends Component {}

class EmployeeManager {
  employeeList = [];
}

class Employee {
  _name;
  _age;
  _address;
  _experience;
  _phoneNum;
  _email;
  _empDate;
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get age() {
    return this._age;
  }
  set age(value) {
    this._age = value;
  }
  get address() {
    return this._address;
  }
  set address(value) {
    this._address = value;
  }
  get experience() {
    return this._experience;
  }
  set experience(value) {
    this._experience = value;
  }
  get phoneNum() {
    return this._phoneNum;
  }
  set phoneNum(value) {
    this._phoneNum = value;
  }
  get email() {
    return this._email;
  }
  set email(value) {
    this._email = value;
  }
  get empDate() {
    return this._empDate;
  }
  set empDate(value) {
    this._empDate = value;
  }
}

Application.init();
