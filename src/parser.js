import { generate } from 'pegjs'
import path from 'path'
import { readFileSync } from 'fs'

const grammar = readFileSync(path.resolve('src/grammar.pegjs'), 'utf8')
const allowedStartRules = grammar.match(/^[\w_]+\s+=/gm).map(ruleName => ruleName.slice(0, -2).trim())
const parser = generate(grammar, { allowedStartRules })

export default parser.parse


// 'true' 'false' 'if then else' 'numbers' ''
//
// ==========================

Expression = 
           '{' _ Expression _ '}'
           / Declaration __ Expression
           / IfStatement __ Expression
           / While __ Expression
           / Operation __ Expression
           / Comment _ Expression
           / Operation
           / Value
		   / IfStatement
           / While
           / Comment
           / Id

Declaration = 'var ' [a-zA-Z]+ [_a-zA-Z0-9]* ';'
            / 'var ' [a-zA-Z]+ [_a-zA-Z0-9]* _ '=' _ Value';'
            / 'var ' [a-zA-Z]+ [_a-zA-Z0-9]* _ '=' _ Operation';'

Comment =  '/*' _ (!'*/' .)* _ '*/'
        / '//' (!'\n' .)* '\n'+

IfStatement = S:('if' '('_ Expression _')' __ 'then' __ Expression __ 'else' __ Expression) {return S}

While = W: ('while ('_ Expression _')'_'{'_ Expression _ '}') {return W}

Operation = Numbers _ Operator _ Operation / Numbers _ Operator _ Numbers / Id _ Operator _ Value

Operator = '+' / '-' / '%' / '*' / '==' / '='

Value = 'true'
      / 'false'
      / Numbers

Id = [a-zA-Z]+ [_a-zA-Z0-9]*

Numbers = Number+
  
Number = '1' / '2' / '3' / '4' / '5' / '6' / '7' / '8' / '9' / '0'
	
_ = __?
__ = [ \t\n\r]+
              