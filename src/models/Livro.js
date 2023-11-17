import mongoose from "mongoose";
import { autorSchema } from "./Autor.js";

const livroSchema = new mongoose.Schema({
	id: {type: mongoose.Schema.Types.ObjectId},
	titulo: {
		type: String,
		required: [true, "O título do livro é obrigatório"]
	},
	editora: {
		type: String,
		required: [true, "A editora do livro é obrigatória"],
		enum: {
			values: ["Casa do Código", "Alura"],
			message: "Editora {VALUE} é um valor inválido"
		}
	},
	preco: {
		type: Number,
		validate: {
			validator: (preco) => preco >= 0,
			message: "O preço deve ser maior ou igual a zero"
		}
	},
	paginas: {
		type: Number,
		min: [5, "O livro deve ter no mínimo 5 páginas"],
		max: [5000, "O livro deve ter no máximo 5000 páginas"]
	},
	autor: autorSchema
}, {versionKey: false});

const livro = mongoose.model("livros", livroSchema);

export default livro;
