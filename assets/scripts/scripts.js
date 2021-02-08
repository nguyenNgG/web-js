class Application {
  static init() {
    const header = new Header();
    Status.init();
    ManipulationInterface.createInterface();
    EmployeeManager.loadFromLocal();
  }
}

class DOMHelpers {
  static clearEventListener(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  static createInput(type, value) {
    const btnInput = document.createElement('input');
    btnInput.setAttribute('type', type);
    btnInput.setAttribute('value', value);
    return btnInput;
  }
}
class Status {
  static lastAction;

  static init() {
    const status = document.querySelector('#status');
    this.lastAction = document.createElement('p');
    status.append(this.lastAction);
  }
}
class Header {
  constructor() {
    const btnAdd = DOMHelpers.createInput('button', 'Add');
    const btnSearch = DOMHelpers.createInput('button', 'Search');
    const btnReset = DOMHelpers.createInput('button', 'Show All');
    const btnSave = DOMHelpers.createInput('button', 'Save to Local');
    const btnLoad = DOMHelpers.createInput('button', 'Load from Local');
    const inputSearch = document.createElement('input');
    inputSearch.setAttribute('type', 'text');
    inputSearch.setAttribute('id', 'searchbar');
    inputSearch.setAttribute('placeholder', 'Search by Name');
    document.querySelector('#header').append(btnAdd);
    document.querySelector('#header').append(inputSearch);
    document.querySelector('#header').append(btnSearch);
    document.querySelector('#header').append(btnReset);
    document.querySelector('#header').append(btnSave);
    document.querySelector('#header').append(btnLoad);
    btnAdd.addEventListener(
      'click',
      ManipulationInterface.renderInterface.bind(ManipulationInterface)
    );
    btnSearch.addEventListener(
      'click',
      Table.renderTable.bind(Table, EmployeeManager.employeeList, true)
    );
    btnReset.addEventListener(
      'click',
      Table.renderTable.bind(Table, EmployeeManager.employeeList, false)
    );
    btnSave.addEventListener(
      'click',
      EmployeeManager.saveToLocal.bind(EmployeeManager)
    );
    btnLoad.addEventListener(
      'click',
      EmployeeManager.loadFromLocal.bind(EmployeeManager)
    );
  }
}

class ManipulationInterface {
  static regexList = [
    /^[a-zA-Z]+(\s?[a-zA-Z]+)*\s*$/,
    /^.*$/,
    /^[a-zA-Z0-9,/]+(\s?[a-zA-Z0-9,/]+)*\s*$/,
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
    const btnSubmit = DOMHelpers.createInput('submit', 'Submit');
    const head = document.createElement('p');
    const ageSelector = document.querySelector('#txtEmpAge');
    const expSelector = document.querySelector('#txtEmpExp');
    this.optionSequencer(18, 60, 1, ageSelector, 18);
    this.optionSequencer(0, 2, 0.5, expSelector, 0);
    head.textContent = 'Add employee';
    head.classList.toggle('header');
    container.insertAdjacentElement('afterbegin', head);
    container.append(btnSubmit);
    EmployeeManager.addButtonSubmitFunction();
  }

  static renderInterface() {
    let backdrop = document.querySelector('.backdrop');
    const container = document.querySelector('.manipCont');
    backdrop = DOMHelpers.clearEventListener(backdrop);
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
        const noError = this.regexCheck(
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

  static regexCheck(text, regex) {
    return text.match(regex) ? true : false;
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

  static renderTable(employeeList, isSearch) {
    Status.lastAction.textContent = 'Table show attempted.';
    const colClassList = [
      'empName',
      'empAge',
      'empAddr',
      'empExp',
      'empPhoneNum',
      'empEmail',
      'empEmplDate',
    ];
    const userSearchInput = document.querySelector('#searchbar');
    const regExp = new RegExp(`^.*${userSearchInput.value}.*$`, 'i');
    this.clearTable();
    let i = 0;
    for (const employee of employeeList) {
      if (isSearch) {
        Status.lastAction.textContent = 'Search attempted.';
        const rs = ManipulationInterface.regexCheck(employee._name, regExp);
        if (!rs) {
          i++;
          continue;
        }
      }
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
    const btnUpdate = DOMHelpers.createInput('button', 'Update');
    const btnDelete = DOMHelpers.createInput('button', 'Delete');
    const btnSubmitUpdate = DOMHelpers.createInput('submit', 'Submit');
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
    btnDelete.addEventListener(
      'click',
      EmployeeManager.removeEmployee.bind(EmployeeManager, row)
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
      Table.renderTable(EmployeeManager.employeeList, false);
      Status.lastAction.textContent = 'Employee updated.';
    } else {
      Status.lastAction.textContent = "Employee couldn't be updated.";
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
        ? column.querySelector('input')
        : column.querySelector('select');

      column.classList.toggle('errorDetected', false);
      userInput.classList.toggle('errorDetected', false);

      const rs = ManipulationInterface.regexCheck(
        userInput.value,
        ManipulationInterface.regexList[i]
      );
      if (!rs) {
        rowData.errorDetected = true;
        column.classList.toggle('errorDetected', true);
        userInput.classList.toggle('errorDetected', true);
      }
      switch (i) {
        case 0:
          rowData._name = userInput.value;
        case 1:
          rowData._age = userInput.value;
        case 2:
          rowData._address = userInput.value;
        case 3:
          rowData._experience = userInput.value;
        case 4:
          rowData._phoneNum = userInput.value;
        case 5:
          rowData._email = userInput.value;
        case 6:
          rowData._empDate = userInput.value;
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
        return a._name.localeCompare(b._name, 'en');
      });
      Table.renderTable(this.employeeList, false);
      Status.lastAction.textContent = 'Employee added.';
    } else {
      Status.lastAction.textContent = "Employee couldn't be added.";
    }
  }

  static removeEmployee(row) {
    this.employeeList.splice(row.getAttribute('rownum'), 1);
    Table.renderTable(this.employeeList, false);
    Status.lastAction.textContent = 'Employee removed.';
  }

  static saveToLocal() {
    localStorage.setItem(
      'database',
      JSON.stringify(Array.from(this.employeeList))
    );
    Status.lastAction.textContent = 'Saved to local storage.';
  }

  static loadFromLocal() {
    this.employeeList.splice(0, this.employeeList.length);
    const localDataJSON = localStorage.getItem('database');
    const localData = JSON.parse(localDataJSON) || [];
    localData.forEach((localObject) => {
      this.employeeList.push(localObject);
    });
    this.employeeList.sort((a, b) => {
      return a._name.localeCompare(b._name, 'en');
    });
    Table.renderTable(this.employeeList, false);
    Status.lastAction.textContent = 'Loaded from local storage.';
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
