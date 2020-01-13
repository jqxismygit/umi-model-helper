import { fetchList } from "../../../services";
import createModel from "umi-model-helper";

const ListModel = createModel("list", {
  fetch: fetchList
});

export default ListModel;
