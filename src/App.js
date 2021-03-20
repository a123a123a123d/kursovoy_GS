import React, {Component} from 'react';
import './App.css';
import firebase from 'firebase'
import 'bootstrap/dist/css/bootstrap.min.css'
import $, { data } from 'jquery'
import Popper from 'popper.js'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import { waitForElementToBeRemoved } from '@testing-library/dom';


export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      //auth
      email: '',
      password: '',
      //froms
      
      mainPage: true,
      loginPage: false,
      signinPage: false,
      tablePage: false,
      //table
      data: [],
      autoincid: 0,
      name: '',
      code: '',
      category: '',
      count: '',
      block: '',
      row: '',
      rack: '',
      note: '',
      deleteid: -1
    }
  }
  
  componentDidMount() {
    const db = firebase.database();
    const product = db.ref('Product');
    product.on('value', (snapshot) => {
      const data = snapshot.val();
      this.setState({data});
    })
    const incid = db.ref('autoinc');
    incid.on('value', (snapshot1)=> {
      const autoincid = snapshot1.val();
      this.setState({autoincid});
    })

  }

  handleChange = ({target: {value ,id}}) => {
    this.setState({
      [id] : value,
    })
  };

  CreateAccount = () => {
    const {email, password} = this.state;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({
          mainPage: false,
          loginPage: true,
          signinPage: false,
          tablePage: false,
        });
        alert("Успешная регистрация");
      })
      .catch(error => console.log(error));
  };

  AccountLogIn = () => {
    const {email, password} = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      this.setState({
        mainPage: false,
        loginPage: false,
        signinPage: false,
        tablePage: true,
      });
      alert("Вход выполнен");
    })
    .catch(error => console.log(error));
  }

  AddProduct = () => {
    let autoincid = this.state.autoincid;
    const { name, code, category, count, block, row, rack, note} = this.state;
    if (name!==''&&code!==''&&category!==''&&count!==''&&block!==''&&row!==''&&rack!=='') {
      autoincid++;
      firebase.database().ref('autoinc').set(autoincid);
      firebase.database().ref('Product/'+autoincid.toString()).set({
        id: autoincid,
        name,
        code,
        category,
        count,
        block,
        row,
        rack,
        note,
      })
    } else {alert("Пустая запись!");}
  }

  DeleteProduct = () => {
    const deleteid = this.state.deleteid;
    if (deleteid>0)
    {
      firebase.database().ref('Product/'+deleteid.toString()).remove();
    }
    else (alert('Error!'));
  }

  goMainPage = () => {
    this.setState({
      mainPage: true,
      loginPage: false,
      signinPage: false,
      tablePage: false,
    })
  }

  goLoginPage = () => {
    this.setState({
      mainPage: false,
      loginPage: true,
      signinPage: false,
      tablePage: false,
    })
  }

  goSigninPage = () => {
    this.setState({
      mainPage: false,
      loginPage: false,
      signinPage: true,
      tablePage: false,
    })
  }



  render() {
    const {data, hasAccount, name, mainPage, loginPage, signinPage, tablePage} = this.state;
    
    return (
      <div>
        { mainPage ?
          (
            <div>
              <h1>
                Курсовой проект по дисциплине "Глобальные сети" <br></br>
                на тему "Разработка одностраничного приложения"
              </h1>
              <h4>
                Для продолжения работы необходимо авторизоваться в системе
                <br></br><br></br>
                <button type="submit" onClick={this.goLoginPage} class="btn btn-primary">Войти</button>
              </h4>
              <h4>
                Нет аккаунта? Зарегистрируйтесь
                <br></br><br></br>
                <button type="submit" onClick={this.goSigninPage} class="btn btn-primary">Регистрация</button>
              </h4>

            </div>
          )
          :
          (
            loginPage ?
            (
              <div class="login_block">
                <div class="mb-3">
                  <label class="form-label">Email адрес</label>
                  <input type="email" class="form-control" id="email" placeholder="email" onChange={this.handleChange}/>
                </div>
                <div class="mb-3">
                  <label  class="form-label">Пароль</label>
                  <input type="password" class="form-control" id="password" placeholder="password" onChange={this.handleChange}/>
                </div>
                <button type="submit" onClick={this.AccountLogIn} class="btn btn-primary">Войти</button>
                <label class="form-label">Нет аккаунта?</label>
                <button type="submit" onClick={this.goSigninPage} class="btn btn-primary">Регистрация</button>
                <br></br>
                <button type="submit" onClick={this.goMainPage} class="btn btn-primary">На главную</button>
              </div>
            )
            :
            (
              signinPage ?
              (
                <div class="login_block">
                  <div class="mb-3">
                    <label class="form-label">Email адрес</label>
                    <input type="email" class="form-control" id="email" placeholder="email" onChange={this.handleChange}/>
                  </div>
                  <div class="mb-3">
                    <label  class="form-label">Пароль</label>
                    <input type="password" class="form-control" id="password" placeholder="password" onChange={this.handleChange}/>
                  </div>
                  <button type="submit" onClick={this.CreateAccount} class="btn btn-primary">Создать аккаунт</button>
                  <label class="form-label">Уже есть аккаунт?</label>
                  <button type="submit" onClick={this.goLoginPage} class="btn btn-primary">Войти</button>
                  <br></br>
                  <button type="submit" onClick={this.goMainPage} class="btn btn-primary">На главную</button>
                </div>
              )
              :
              (
                tablePage ?
                (
                  <div>
                    <table class="table">
                      <tbody>
                      <tr>
                      <td>
                        <button type="submit" onClick={this.goMainPage} class="btn btn-primary">На главную</button>
                      </td>
                      <td>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal2">Справка</button>
                        <div class="modal" tabindex="-1" id="exampleModal2">
                          <div class="modal-dialog">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title">Справка</h5>
                              </div>
                              <div class="modal-body">
                              <p>
                              Чтобы добавить продукт в систему необходимо заполнить поля в нижней части экрана и нажать на кнопку «Добавить». Что бы удалить продукт из системы необходимо указать идентификатор записи и нажать кнопку «Удалить».
                              </p>
                              </div>
                              <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Добавить</button>
                        <div class="modal" tabindex="-1" id="exampleModal">
                          <div class="modal-dialog">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title">Добавить</h5>
                              </div>
                              <div class="modal-body">
                                <input class="form-control" type="name" id="name" placeholder="Наименование" onChange={this.handleChange}/>  
                                <input class="form-control" type="code" id="code" placeholder="Код" onChange={this.handleChange}/>
                                <input class="form-control" type="category" id="category" placeholder="Категория" onChange={this.handleChange}/>  
                                <input class="form-control" type="count" id="count" placeholder="Количество" onChange={this.handleChange}/>  
                                <input class="form-control" type="block" id="block" placeholder="Блок" onChange={this.handleChange}/>  
                                <input class="form-control" type="row" id="row" placeholder="Ряд" onChange={this.handleChange}/>  
                                <input class="form-control" type="rack" id="rack" placeholder="Полка" onChange={this.handleChange}/>  
                                <input class="form-control" type="note" id="note" placeholder="Примечание" onChange={this.handleChange}/>  
                              </div>
                              <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={this.AddProduct}>Добавить</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td> 
                      <td>
                        <button type="submit" data-bs-toggle="modal" data-bs-target="#exampleModal1" class="btn btn-primary">Удалить</button>
                        <div class="modal" tabindex="-1" id="exampleModal1">
                          <div class="modal-dialog">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title">Удалить</h5>
                              </div>
                              <div class="modal-body">
                              <input class="form-control" type="deleteid" id="deleteid" placeholder="#" onChange={this.handleChange}/>     
                              </div>
                              <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={this.DeleteProduct}>Удалить</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                    </tr>
                      </tbody>
                    </table>
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Наименование</th>
                          <th scope="col">Код</th>
                          <th scope="col">Категория</th>
                          <th scope="col">Кол-во</th>
                          <th scope="col">Блок</th>
                          <th scope="col">Ряд</th>
                          <th scope="col">Полка</th>
                          <th scope="col">Примечание</th>
                        </tr>
                      </thead>
                      <tbody>            
                      {
                        data.map(item =>(
                          <tr>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td align="center">{item.code}</td>
                            <td align="center">{item.category}</td>
                            <td align="center">{item.count}</td>
                            <td align="center">{item.block}</td>
                            <td align="center">{item.row}</td>
                            <td align="center">{item.rack}</td>
                            <td>{item.note}</td>
                          </tr>
                        ))
                      }
                                       
                      </tbody>
                    </table>
                  </div>
                )
                :
                (
                  <div></div>
                )

              )
            )

          )
        }
      </div>      
    )
  }
}
