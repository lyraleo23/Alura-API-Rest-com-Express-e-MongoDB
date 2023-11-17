import {livro} from "../models/index.js";
import { autor } from "../models/Autor.js";
import NaoEncontrado from "../erros/NaoEncontrado.js";

class LivroController {

	static async listarLivros (req, res, next) {
		try {
			const buscaLivros = livro.find();
			req.resultado = buscaLivros;

			next();
		} catch (erro) {
			next(erro);
		}
	}

	static async listarLivroPorId (req, res, next) {
		try {
			const id = req.params.id;
			const livroEncontrado = await livro.findById(id);

			if (livroEncontrado !== null) {
				res.status(200).json(livroEncontrado);
			} else {
				next(new NaoEncontrado("Id não encontrado"));
			}
		} catch (erro) {
			next(erro);
		}
	}

	static async cadastrarLivro (req, res, next) {
		const novoLivro = req.body;

		try {
			const autorEncontrado = await autor.findById(novoLivro.autor);
			const livroCompleto = {...novoLivro, autor: {...autorEncontrado._doc}};

			const livroCriado = await livro.create(livroCompleto);

			res.status(201).json({message: "criado com sucesso", livro: livroCriado});
		} catch (erro) {
			next(erro);
		}
	}

	static async atualizarLivro (req, res, next) {
		try {
			const id = req.params.id;
			await livro.findByIdAndUpdate(id, req.body);
			res.status(200).json({message: "livro atualizado"});
		} catch (erro) {
			next(erro);
		}
	}

	static async excluirLivro (req, res, next) {
		try {
			const id = req.params.id;
			await livro.findByIdAndDelete(id, req.body);
			res.status(200).json({message: "livro excluído com sucesso"});
		} catch (erro) {
			next(erro);
		}
	}

	static async listarLivrosPorFiltro (req, res, next) {
		try {
			const busca = await processoBusca(req.query);

			if (busca !== null) {
				const livrosPorFiltro = livro.find(busca);
				req.resultado = livrosPorFiltro;
				next();
			} 
			else {
				res.status(200).send([]);
			}
		} catch (erro) {
			next(erro);
		}
	}

}

async function processoBusca(parametros) {
	const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = parametros;

	let busca = {};

	if (editora) busca.editora = { $regex: editora, $options: "i"};
	if (titulo) busca.titulo = { $regex: titulo, $options: "i"};

	if (minPaginas ||maxPaginas) busca.numeroPaginas = {};

	if (minPaginas) busca.numeroPaginas.$gte = minPaginas;
	if (maxPaginas) busca.numeroPaginas.$lte = maxPaginas;

	if (nomeAutor) {
		const autorEncontrado = await autor.findOne({nome: nomeAutor});

		if (autorEncontrado !== null) {
			busca.autor = autorEncontrado._doc;
		}
		else {
			busca = null;
		}
	}

	return busca;
}

export default LivroController;
