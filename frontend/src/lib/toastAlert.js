import store from "../redux/store";
import { v4 as uuid } from "uuid";
import { addToast } from "../redux/slices/toast.slice";

export const toastAlert = ({ type, message }) => {
  store.dispatch(addToast({ type, message, isOpen: true, id: uuid() }));
};
