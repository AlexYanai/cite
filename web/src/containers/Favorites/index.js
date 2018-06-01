// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Category, Citation } from '../../types';
import Navbar from '../../containers/Navbar';
import { logout } from '../../actions/session';
import { showModal } from '../../actions/modal';
import { showSearchForm, endOfCitations, fetchPaginatedCitations, createCitation, deleteCitation, editCitation } from '../../actions/citations';
import CitationListItem from '../../components/CitationListItem';
import CitationForm from '../../components/CitationForm';
import SearchForm from '../../components/SearchForm';

type Props = {
  currentUser: Object,
  paginatedCitations: Array<Citation>,
  categories: Array<Category>,
  isAuthenticated: boolean,
  isModalOpen: boolean,
  isSearchFormOpen: boolean,
  reachedEnd: boolean,
  isEditModalOpen: boolean,
  fetchPaginatedCitations: () => void,
  createCitation: () => void,
  deleteCitation: () => void,
  editCitation: () => void,
  showModal: () => void,
  showSearchForm: () => void,
  editFormData: Citation
};

class Favorites extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.fetchPaginatedCitations({page: 1, id: this.props.currentUser.id, route: 'favorites'});
      this.props.showSearchForm(true);
    }
  }

  props: Props

  handleLogout            =  ()  => this.props.logout(this.context.router);
  showCitationModal       =  ()  => this.props.showModal(this.props.isModalOpen);
  handleNewCitationSubmit = data => this.props.createCitation(data, this.context.router, this.props.currentUser);
  handleDeleteCitation    = data => this.props.deleteCitation(this.context.router, this.props.currentUser, data);
  handleEditCitation      = data => this.props.editCitation(this.context.router, this.props.currentUser, data, false);
  showSearch              = ()   => this.props.showSearchForm(this.props.isSearchFormOpen);

  fetchPaginated(isSearch, data = {}) {
    var page_num   = isSearch ? 0 : this.props.pagination.page_number;
    var categories = data.categories !== undefined ? data.categories : [];

    if (categories.length === 0 && this.props.searchCategories !== undefined) {
      categories = this.props.searchCategories;
    }

    if (this.props.pagination.total_pages > page_num || isSearch) {
      page_num += 1;

      const cites  = isSearch ? [] : this.props.paginatedCitations;
      const params = {
        id: this.props.currentUser.id,
        page: page_num, 
        categories: categories,
        route: 'favorites'
      }

      this.props.fetchPaginatedCitations(params, cites);
    } else {
      this.props.endOfCitations();
    }
  }

  renderCitations(pagCitations) {
    if (pagCitations === undefined) {
      return null;
    }

    return pagCitations.map(citation =>
      <CitationListItem
        key={citation.data.id}
        citation={citation.data}
        pagCitations={pagCitations}
        currentUser={this.props.currentUser}
        showCitationModal={this.showCitationModal}
        handleDeleteCitation={this.handleDeleteCitation}
      />
    );
  }

  render() {
    const { isAuthenticated, isModalOpen, isEditModalOpen, currentUser } = this.props;
    const modalProps = { isAuthenticated, isModalOpen, isEditModalOpen, currentUser };

    return (
      <div style={{ flex: '1', overflow: 'scroll' }}>
        <Navbar currentUser={this.props.currentUser} />
        <div className="citations-list-container">
          <div className="citations-button-row">
            <h3 style={{ margin: 'auto' }}>Favorites</h3>
          </div>
          
          {this.props.isSearchFormOpen && 
            <SearchForm 
              onSubmit={this.fetchPaginated.bind(this, true)} 
              categories={this.props.categories} 
              showSearch={this.props.showSearch} 
            />
          }

          {!this.props.isSearchFormOpen && 
            <button className="btn btn-link" onClick={this.showSearch}>
              Filter by category
            </button>
          }

          {(this.props.isModalOpen || this.props.isEditModalOpen) &&
            <CitationForm 
              onNewSubmit={this.handleNewCitationSubmit} 
              onEditSubmit={this.handleEditCitation} 
              showModal={this.showCitationModal} 
              categories={this.props.categories} 
              citation={this.props.editFormData} {...modalProps} 
            />
          }

          {this.renderCitations(this.props.paginatedCitations)}

          <button className="btn btn-link" onClick={this.fetchPaginated.bind(this, false)}>
            {this.props.reachedEnd ? "You've reached the end" : 'More...'}
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    isAuthenticated: state.session.isAuthenticated,
    currentUser: state.session.currentUser,
    categories: state.citations.categories,
    paginatedCitations: state.citations.paginatedCitations,
    searchCategories: state.citations.searchCategories,
    pagination: state.citations.pagination,
    reachedEnd: state.citations.reachedEnd,
    editFormData: state.modal.editFormData,
    initialValues: state.modal.initialValues,
    isModalOpen: state.modal.isModalOpen,
    isSearchFormOpen: state.citations.isSearchFormOpen,
    isEditModalOpen: state.modal.isEditModalOpen,
  }),
  { logout, showSearchForm, endOfCitations, fetchPaginatedCitations, createCitation, deleteCitation, editCitation, showModal }
)(Favorites);
