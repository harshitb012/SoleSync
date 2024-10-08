import { ALL_PRODUCT_FAIL, ALL_PRODUCT_REQUEST, ALL_PRODUCT_SUCCESS, CLEAR_ERRORS, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL,  ADMIN_PRODUCT_REQUEST,
  ADMIN_PRODUCT_SUCCESS,
  ADMIN_PRODUCT_FAIL,  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL, NEW_PRODUCT_RESET} from "../constants/productConstant";

const initialProductsState = {
  products: [],
  loading: false,
  error: null,
  productsCount: 0,
  resultPerPage:8,

};

export const productReducer = (state = initialProductsState, action) => {
  switch (action.type) {
    case ALL_PRODUCT_REQUEST:
      case ADMIN_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        products: [], 
      };
    case ALL_PRODUCT_SUCCESS:
    
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        productsCount: action.payload.productsCount,
        resultPerPage:action.payload.resultPerPage,
        filteredProductsCount:action.payload.filteredProductsCount,
      };

      case ADMIN_PRODUCT_SUCCESS:
        return{
          loading:false,
          products:action.payload,
        }
    case ALL_PRODUCT_FAIL:
      case ADMIN_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        products: [], 
        productsCount: 0, 
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
const initialProductDetailsState = {
  product: {}, 
  loading: false,
  error: null,
};

export const productDetailsReducer = (state = initialProductDetailsState, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload, 
      };
    case PRODUCT_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const newProductReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case NEW_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_PRODUCT_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        product: action.payload.product,
      };
    case NEW_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_PRODUCT_RESET:
      return {
        ...state,
        success: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};