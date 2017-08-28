const lodash = require("lodash");

export function showModal(modalOpen) {
  return (dispatch) => {
    const open = !modalOpen;

    dispatch({ 
      type: 'SHOW_MODAL',
      isModalOpen: open
    });
  };
}

export function showEditModal(modalOpen, editFormData) {
  return (dispatch) => {
    const open        = !modalOpen;
    const newFormData = extractCategories(editFormData);

    dispatch({ 
      type: 'SHOW_EDIT_MODAL',
      isEditModalOpen: open,
      editFormData: newFormData
    });
  };
}

function extractCategories(editFormData) {
  var clonedFormData = lodash.cloneDeep(editFormData);
  
  if (clonedFormData && clonedFormData.categories && !lodash.isEmpty(clonedFormData.categories)) {
    var categories = clonedFormData.categories;

    if (categories) {
      clonedFormData.categories = categories.map(function(x) { return x.name });
    }
  }

  return clonedFormData;
}
