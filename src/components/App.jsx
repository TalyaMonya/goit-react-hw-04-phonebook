import React, { Component } from "react";
import { nanoid } from 'nanoid';
import { Layout, Title, SubTitle, Empty } from "./Layout";
import { ContactForm } from "./ContactForm/ContactForm";
import { ContactList } from './ContactList/ContactList';
import { Filter } from "./Filter/Filter";

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };


  componentDidMount() {
    const contacts = localStorage.getItem('contacts'); // Отримуємо дані з LocalStorage
    const parsedContacts = JSON.parse(contacts); // Перетворюємо з строки JSON в обʼєкт JS

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts }); // Записуємо отримані дані в state
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts)); // Якщо контакти змінились, записуємо в LocalStorage
    }
  }

  // Додавання нового контакту в список котактів
  addContact = contact => {
    const isInContact = this.state.contacts.some(
      ({ name }) => name.toLowerCase() === contact.name.toLowerCase()
    );

    if (isInContact) {
      alert(`${contact.name} is already in contacts`);
      return;
    }
    this.setState(prevState => ({
      contacts: [{ id: nanoid(), ...contact }, ...prevState.contacts],
    }));
  };
  
  // Зміна значення фільтру
  changeFilter = e => {
    this.setState({ filter: e.target.value });
  };

  // Отримання відфільтрованих контактів
  getVisibleContacts = () => {
    const { filter, contacts } = this.state;
    const normilizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normilizedFilter)
    );
  };

  // Видалення контакту зі списку

  removeContact = contactId => {
    this.setState(prevState => {
      return {
        contacts: prevState.contacts.filter(({ id }) => id !== contactId),
      };
    });
  };


  render() {
    const visibleContacts = this.getVisibleContacts();
    const { filter } = this.state;

    return (
      <Layout>
        <Title>Your Phonebook</Title>
        <ContactForm onAdd={this.addContact} />

        <SubTitle>Contacts</SubTitle>
        {this.state.contacts.length > 0 ? (
          <Filter value={filter} onChangeFilter={this.changeFilter} />
        ) : (
            <Empty>Your phonebook is empty. Add first contact!</Empty>
        )}
        {this.state.contacts.length > 0 && (
          <ContactList
            contacts={visibleContacts}
            onRemoteContact={this.removeContact} />
        )}
      </Layout>
    )
  }
}
