import mongoose from "mongoose";

mongoose.Schema.Types.String.set("validate", {
	validator: (valor) => valor.trim() !== "",
	message: "O campo {PATH} precisa ser preenchido"
});
