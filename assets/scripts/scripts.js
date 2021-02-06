class Application {
  static init() {
    const header = new Header();
    ManipulationInterface.createInterface();
  }
}

class DOMHelpers {
  static clearEventListener(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
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
  _btnAdd;

  constructor() {
    super();
    this._btnAdd = new Button('button', 'Add');
    document.querySelector('#header').append(this._btnAdd._btn);
    this._btnAdd._btn.addEventListener(
      'click',
      ManipulationInterface.renderInterface.bind(ManipulationInterface)
    );
  }
}

class ManipulationInterface {
  static regexList = [
    /^[a-zA-Z]+(\s?[a-zA-Z]+)*\s*$/,
    /^.*$/,
    /^[a-zA-Z0-9,]+(\s?[a-zA-Z0-9,]+)*\s*$/,
    /^.*$/,
    /[0-9]{10,12}/,
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    /^.*$/,
  ];

  static optionSequencer(initial, end, jump, parent, selected) {
    for (let i = initial; i <= end; i = i + jump) {
      const option = document.createElement('option');
      option.setAttribute('value', i);
      option.textContent = i;
      if (i == selected) {
        option.setAttribute('selected', '');
      }
      parent.append(option);
    }
  }
  static createInterface() {
    const container = document.querySelector('.manipCont');
    const btnSubmit = new Button('submit', 'Submit');
    const head = document.createElement('p');
    const ageSelector = document.querySelector('#txtEmpAge');
    const expSelector = document.querySelector('#txtEmpExp');
    // const empMngr = new EmployeeManager();
    this.optionSequencer(18, 60, 1, ageSelector, 18);
    this.optionSequencer(0, 2, 0.5, expSelector, 0);
    head.textContent = 'Add employee';
    head.classList.toggle('header');
    container.insertAdjacentElement('afterbegin', head);
    container.append(btnSubmit._btn);
    EmployeeManager.addButtonSubmitFunction();
  }

  static renderInterface() {
    let backdrop = document.querySelector('.backdrop');
    backdrop = DOMHelpers.clearEventListener(backdrop);
    const container = document.querySelector('.manipCont');
    backdrop.classList.toggle('visible');
    container.classList.toggle('visible');
    backdrop.addEventListener('click', this.closeInterface.bind(this));
    container.style.position = 'absolute';
  }

  static closeInterface() {
    const backdrop = document.querySelector('.backdrop');
    const container = document.querySelector('.manipCont');
    backdrop.classList.toggle('visible');
    container.classList.toggle('visible');
  }

  static checkSubmit() {
    const container = document.querySelector('.manipCont');
    const userInputs = container.querySelectorAll('input');
    const userSelects = container.querySelectorAll('select');
    const errorTexts = container.querySelectorAll('.txtError');
    const userSubmit = {
      empName: userInputs[0],
      empAge: userSelects[0].options[userSelects[0].selectedIndex],
      empAddr: userInputs[1],
      empExp: userSelects[1].options[userSelects[1].selectedIndex],
      empPhoneNum: userInputs[2],
      empEmail: userInputs[3],
      empDate: userInputs[4],
    };
    let i = 0;
    let errorDetected = false;
    for (const key in userSubmit) {
      if (Object.hasOwnProperty.call(userSubmit, key)) {
        const noError = this.checkError(
          userSubmit[key].value,
          this.regexList[i]
        );
        if (!noError) {
          errorDetected = true;
          errorTexts[i].classList.toggle('visible', true);
        } else {
          errorTexts[i].classList.toggle('visible', false);
        }
        i++;
      }
    }
    const result = errorDetected ? null : userSubmit;
    return result;
  }

  static checkError(userInput, regex) {
    return userInput.match(regex) ? true : false;
  }
}

class Table {
  static clearTable() {
    const table = document.querySelector('body table.tblContainer');
    const rows = table.querySelectorAll('tr.data');
    rows.forEach((row) => {
      row.remove();
    });
  }
  static renderTable(employeeList) {
    const colClassList = [
      'empName',
      'empAge',
      'empAddr',
      'empExp',
      'empPhoneNum',
      'empEmail',
      'empEmplDate',
    ];
    this.clearTable();
    let i = 0;
    for (const employee of employeeList) {
      let j = 0;
      const table = document.querySelector('body table.tblContainer');
      const row = document.createElement('tr');
      row.setAttribute('rowNum', i);
      row.setAttribute('class', 'data');
      for (const key in employee) {
        if (Object.hasOwnProperty.call(employee, key)) {
          const data = document.createElement('td');
          data.setAttribute('class', colClassList[j]);
          data.textContent = employee[key];
          row.append(data);
          j++;
        }
      }
      table.append(row);
      this.addRowManipulation(row);
      i++;
    }
  }

  static addRowManipulation(row) {
    const btnUpdate = document.createElement('input');
    btnUpdate.setAttribute('type', 'submit');
    btnUpdate.setAttribute('value', 'Update');
    const btnDelete = document.createElement('input');
    btnDelete.setAttribute('type', 'submit');
    btnDelete.setAttribute('value', 'Delete');
    const btnSubmitUpdate = document.createElement('input');
    btnSubmitUpdate.setAttribute('type', 'submit');
    btnSubmitUpdate.setAttribute('value', 'Submit');
    const btnCol = row.insertCell(-1);
    btnCol.append(btnUpdate);
    btnCol.append(btnSubmitUpdate);
    btnCol.append(btnDelete);
    btnUpdate.classList.toggle('visible');
    btnDelete.classList.toggle('visible');
    btnUpdate.addEventListener(
      'click',
      this.rowManipulationToggle.bind(
        this,
        row,
        btnUpdate,
        btnSubmitUpdate,
        btnDelete
      )
    );
    btnSubmitUpdate.addEventListener(
      'click',
      this.rowSubmitManipulation.bind(this, row)
    );
  }

  static rowManipulationToggle(row, btnUpdate, btnSubmitUpdate, btnDelete) {
    btnUpdate.classList.toggle('visible', false);
    btnDelete.classList.toggle('visible', false);
    btnSubmitUpdate.classList.toggle('visible', true);
    this.rowManipulationFunction(row);
  }

  static rowManipulationFunction(row) {
    const dataColumns = row.querySelectorAll('td');
    let i = 0;
    for (const column of dataColumns) {
      if (i <= 6) {
        let fieldElement;
        const colData = column.textContent;
        if (column.getAttribute('class') === 'empAge') {
          const selectField = document.createElement('select');
          ManipulationInterface.optionSequencer(
            18,
            60,
            1,
            selectField,
            colData
          );
          fieldElement = selectField;
        } else if (column.getAttribute('class') === 'empExp') {
          const selectField = document.createElement('select');
          ManipulationInterface.optionSequencer(
            0,
            2,
            0.5,
            selectField,
            colData
          );
          fieldElement = selectField;
        } else if (column.getAttribute('class') === 'empEmplDate') {
          const inputField = document.createElement('input');
          inputField.setAttribute('type', 'date');
          inputField.setAttribute('value', colData);
          inputField.setAttribute('min', '2000-01-01');
          inputField.setAttribute('max', '2020-12-31');
          fieldElement = inputField;
        } else {
          const inputField = document.createElement('input');
          inputField.setAttribute('value', colData);
          inputField.setAttribute('type', 'text');
          fieldElement = inputField;
        }
        column.innerHTML = '';
        column.append(fieldElement);
        i++;
      }
    }
  }

  static rowSubmitManipulation(row) {
    const rowData = Table.rowCheckManipulationSubmit(row);
    if (!rowData.errorDetected) {
      const rowNum = row.getAttribute('rownum');
      const employeeOld = EmployeeManager.employeeList[rowNum];
      employeeOld._name = rowData._name;
      employeeOld._age = rowData._age;
      employeeOld._address = rowData._address;
      employeeOld._experience = rowData._experience;
      employeeOld._phoneNum = rowData._phoneNum;
      employeeOld._email = rowData._email;
      employeeOld._empDate = rowData._empDate;
      Table.renderTable(EmployeeManager.employeeList);
    }
  }

  static rowCheckManipulationSubmit(row) {
    const dataColumns = row.querySelectorAll('td');
    let i = 0;
    let rowData = {
      errorDetected: false,
      _name: '',
      _age: '',
      _address: '',
      _experience: '',
      _phoneNum: '',
      _email: '',
      _empDate: '',
    };

    for (const column of dataColumns) {
      const userInput = column.querySelector('input')
        ? column.querySelector('input').value
        : column.querySelector('select').value;
      const rs = ManipulationInterface.checkError(
        userInput,
        ManipulationInterface.regexList[i]
      );
      if (!rs) {
        rowData.errorDetected = true;
      }
      switch (i) {
        case 0:
          rowData._name = userInput;
        case 1:
          rowData._age = userInput;
        case 2:
          rowData._address = userInput;
        case 3:
          rowData._experience = userInput;
        case 4:
          rowData._phoneNum = userInput;
        case 5:
          rowData._email = userInput;
        case 6:
          rowData._empDate = userInput;
      }
      i++;
    }
    return rowData;
  }
}

class EmployeeManager {
  static employeeList = [];

  static addButtonSubmitFunction() {
    const container = document.querySelector('.manipCont');
    const btnSubmit = container.querySelector('input[type="submit"]');
    btnSubmit.addEventListener('click', this.addEmployee.bind(this));
  }
  static addEmployee() {
    const submitData = ManipulationInterface.checkSubmit();
    if (submitData != null) {
      const employee = new Employee(
        submitData.empName.value,
        submitData.empAge.value,
        submitData.empAddr.value,
        submitData.empExp.value,
        submitData.empPhoneNum.value,
        submitData.empEmail.value,
        submitData.empDate.value
      );
      this.employeeList.push(employee);
      this.employeeList.sort((a, b) => {
        return +(a._name > b._name) || -(a._name <= b._name);
      });
      Table.renderTable(this.employeeList);
    }
  }
}

class Employee {
  _name;
  _age;
  _address;
  _experience;
  _phoneNum;
  _email;
  _empDate;

  constructor(name, age, address, experience, phoneNum, email, empDate) {
    this._name = name;
    this._age = age;
    this._address = address;
    this._experience = experience;
    this._phoneNum = phoneNum;
    this._email = email;
    this._empDate = empDate;
  }
}

Application.init();
