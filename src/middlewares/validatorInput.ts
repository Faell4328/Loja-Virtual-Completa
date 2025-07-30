import { body } from 'express-validator';

export const validateSystemConfig = [
    body('name')
        .notEmpty().withMessage('Falta o nome')
        .trim()
        .escape()
        .isLength({ min: 2 }).withMessage('Nome precisa ter mais que 2 caracteres')
        .isLength({ max: 100 }).withMessage('O nome deve ter no máximo 100 caracteres'),
    body('file').custom((value, {req}) => {
        if(!req.file){
            throw new Error('Falta o arquivo')
        }
        return true;
    })
]

export const validateRegister = [
    body('name')
        .notEmpty().withMessage('Falta o nome')
        .trim()
        .escape()
        .isLength({ min: 2 }).withMessage('Nome precisa ter no mínimo 2 caracteres')
        .isLength({ max: 100 }).withMessage('O nome deve ter no máximo 100 caracteres'),

    body('email')
        .notEmpty().withMessage('Falta o email')
        .trim()
        .escape()
        .normalizeEmail()
        .isEmail().withMessage('Email inválido')
        .isLength({ min: 2 }).withMessage('Email precisa ter no mínimo 2 caracteres')
        .isLength({ max: 100 }).withMessage('O email deve ter no máximo 100 caracteres'),

    body('phone')
        .notEmpty().withMessage('Falta o telefone')
        .trim()
        .escape()
        .isLength({ min: 10, max: 10 }).withMessage('Seu número de telefone deve ter 10 caracteres'),

    body('password')
        .notEmpty().withMessage('Falta a senha')
        .isLength({ min: 8 }).withMessage('A senha deve ter no mínimo 8 caracteres')
        .isLength({ max: 30 }).withMessage('A senha deve ter no máximo 30 caracteres')
]

export const validateLogin = [
    body('email')
        .notEmpty().withMessage('Falta o email')
        .trim()
        .escape()
        .normalizeEmail()
        .isEmail().withMessage('Email invalido')
        .isLength({ max: 100 }).withMessage('O email deve ter no máximo 100 caracteres'),

    body('password')
        .notEmpty().withMessage('Falta a senha')
]

export const validateEmail = [
    body('email')
        .notEmpty().withMessage('Falta o email')
        .normalizeEmail()
        .trim()
        .escape()
        .isEmail().withMessage('Email invalido')
        .isLength({ min: 2 }).withMessage('Email precisa ter no mínimo 2 caracteres')
        .isLength({ max: 100 }).withMessage('O email deve ter no máximo 100 caracteres')
]

export const validatePassword = [
    body('password1')
        .notEmpty().withMessage('Falta a senha 1')
        .isLength({ min: 8 }).withMessage('A senha 1 deve ter no mínimo 8 caracteres')
        .isLength({ max: 30 }).withMessage('A senha 1 deve ter no máximo 30 caracteres'),

    body('password2')
        .notEmpty().withMessage('Falta a senha 2')
]

export const validateInformationUser = [
    body('name')
        .notEmpty().withMessage('Falta o nome')
        .trim()
        .escape()
        .isLength({ min: 2 }).withMessage('Seu nome deve ter no mínimo 2 caracteres')
        .isLength({ max: 100 }).withMessage('Seu nome deve ter no máximo 100 caracteres'),
    body('phone')
        .notEmpty().withMessage('Falta o telefone')
        .trim()
        .escape()
        .isLength({ min: 10, max: 10 }).withMessage('Seu número deve ter 10 caracteres'),
];

export const validateStatus = [
    body('status')
        .notEmpty().withMessage('Foi enviado sem status')
        .isIn(["OK", "BLOCKED"]).withMessage("Status inválido")
]

export const validatesInformationAddress = [
    body('name')
        .notEmpty().withMessage('Falta a descrição')
        .trim()
        .escape()
        .isLength({ max: 50 }).withMessage('A descrição não pode passar de 100 caracteres'),

    body('street')
        .notEmpty().withMessage('Falta a rua')
        .trim()
        .escape()
        .isLength({ max: 100 }).withMessage('Nome da rua não pode passar de 100 caracteres'),

    body('number')
        .notEmpty().withMessage('Falta o número')
        .trim()
        .escape()
        .isLength({ max: 20 }).withMessage('O número não pode passar de 20 caracteres'),

    body('neighborhood')
        .notEmpty().withMessage('Falta o bairro')
        .trim()
        .escape()
        .isLength({ max: 100 }).withMessage('O bairro não pode passar de 100 caracteres'),
    
    body('zipCode')
        .notEmpty().withMessage('Falta o estado')
        .trim()
        .escape()
        .isLength({ max: 9 }).withMessage('O CEP não pode passar de 9 caracteres'),

    body('city')
        .notEmpty().withMessage('Falta a cidade')
        .trim()
        .escape()
        .isLength({ max: 100 }).withMessage('A cidade não pode passar de 100 caracteres'),
    
    body('state')
        .notEmpty().withMessage('Falta o estado')
        .trim()
        .escape()
        .isLength({ min: 2, max: 2 }).withMessage('O estado deve ter 2 caracteres'),
    
    body('complement')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 100 }).withMessage('O complemento não pode passar de de 100 caracteres'),
];

export const validateCategory = [
    body('name')
        .notEmpty().withMessage('Falta o nome')
        .trim()
        .escape()
        .isLength({ min: 2 }).withMessage('O nome da categoria deve ter no mínimo 2 caracteres')
        .isLength({ max: 100 }).withMessage('O nome da categoria não pode passar de de 100 caracteres'),
]

export const validateCreatedProduct = [
    body('name')
        .notEmpty().withMessage('Falta o nome do produto')
        .trim()
        .escape()
        .isLength({ min: 2 }).withMessage('Nome precisa ter mais que 2 caracteres')
        .isLength({ max: 100 }).withMessage('O nome deve ter no máximo 100 caracteres'),

    body('originalPrice')
        .trim()
        .escape()
        .notEmpty().withMessage('Falta o preço do produto')
        .isFloat({ min: 0 }).withMessage('Não é permitido valor negativo'),

    body('promotionPrice')
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1 }).withMessage('Não é permitido opção vazio, se não quer colocar promoção, coloque o valor em 0')
        .isFloat({ min: 0 }).withMessage('Não é permitido valor negativo'),

    body('categoryId')
        .notEmpty().withMessage('Falta a categoria do produto')
        .trim()
        .escape(),

    body('description')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 400 }).withMessage('A descrição deve ter no máximo 400 caracteres'),

    body('homeSession')
        .notEmpty().withMessage('Falta a seção da home, onde o produto vai ficar')
        .trim()
        .escape()
        .isIn(['PROMOTION', 'NEW', 'HIGHLIGHTS']).withMessage('Status inválido. Valores permitidos: \'PROMOTION\', \'NEW\', \'HIGHLIGHTS\''),

    body('option')
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1 }).withMessage('Não é permitido opção vazia')
        .isLength({ max: 100 }).withMessage('As opções não pode deve ter mais que 100 caracteres'),

    body('quantity')
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1 }).withMessage('Não é permitido quantidade vazia')
        .isFloat({ min: 0 }).withMessage('Não é permitido valor negativo na quantidade'),

    body('file').custom((value, {req}) => {
        if(req.files != undefined && req.files.length <= 0){
            throw new Error('Não foi enviado imagem, é necessário enviar ao menos uma imagem')
        }
        return true;
    })
]

export const validateChangedProduct = [
    body('name')
        .notEmpty().withMessage('Falta o nome do produto')
        .trim()
        .escape()
        .isLength({ min: 2 }).withMessage('Nome precisa ter mais que 2 caracteres')
        .isLength({ max: 100 }).withMessage('O nome deve ter no máximo 100 caracteres'),

    body('originalPrice')
        .trim()
        .escape()
        .notEmpty().withMessage('Falta o preço do produto')
        .isFloat({ min: 0 }).withMessage('Não é permitido valor negativo'),

    body('promotionPrice')
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1 }).withMessage('Não é permitido opção vazio, se não quer colocar promoção, coloque o valor em 0')
        .isFloat({ min: 0 }).withMessage('Não é permitido valor negativo'),

    body('categoryId')
        .notEmpty().withMessage('Falta a categoria do produto')
        .trim()
        .escape()
        .isLength({ max: 200 }).withMessage('A categoria deve ter no máximo 200 caracteres'),

    body('description')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 100 }).withMessage('A descrição deve ter no máximo 100 caracteres'),
]

export const validateOptionProduct = [
    body('option')
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1 }).withMessage('Não é permitido opção vazia')
        .isLength({ max: 100 }).withMessage('A opção não pode deve ter mais que 100 caracteres'),

    body('quantity')
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1 }).withMessage('Não é permitido quantidade vazia')
        .isFloat({ min: 0 }).withMessage('Não é permitido valor negativo na quantidade'),
];

export const validateFile = [
    body('file').custom((value, {req}) => {
        if(!req.file){
            throw new Error('Falta o arquivo')
        }
        return true;
    })
];