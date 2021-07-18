package rule_match

import (
	"go/ast"
	"go/parser"
	"go/token"
	"testing"

	"github.com/stretchr/testify/assert"
)

// Eval : 判断 map 是否符合 bool 表达式
// expr = `a > 1 && b < 0`
func Eval(m map[string]string, expr string) (bool, error) {
	fset := token.NewFileSet()
	exprAst, err := parser.ParseExpr(expr)
	if err != nil {
		return false, err
	}

	ast.Print(fset, exprAst)
	return judge(exprAst, m), nil
}

func isLeaf(bop ast.Node) bool {
	expr, ok := bop.(*ast.BinaryExpr)
	if !ok {
		return false
	}
	_, okL := expr.X.(*ast.Ident)
	_, okR := expr.Y.(*ast.BasicLit)
	if okL && okR {
		return true
	}
	return false
}

// dfs
func judge(bop ast.Node, m map[string]string) bool {
	if isLeaf(bop) {
		// do the leaf logic
		expr := bop.(*ast.BinaryExpr)
		x := expr.X.(*ast.Ident)
		y := expr.Y.(*ast.BasicLit)

		switch expr.Op {
		case token.GTR:
			return m[x.Name] > y.Value
		case token.LSS:
			return m[x.Name] < y.Value
		default:
			return false
		}
	}

	// not leaf
	// 那么一定是 binary expression
	expr, ok := bop.(*ast.BinaryExpr)
	if !ok {
		println("this cannot be true")
		return false
	}

	switch expr.Op {
	case token.LAND:
		return judge(expr.X, m) && judge(expr.Y, m)
	case token.LOR:
		return judge(expr.X, m) || judge(expr.Y, m)
	}

	println("unsupported operator")
	return false
}

type testCase struct {
	m      map[string]string
	expr   string
	result bool
}

func TestMapExp(t *testing.T) {
	cases := []testCase{
		{
			m: map[string]string{
				"invest": "20000",
				"posts":  "144",
			},
			expr:   `invest > 10000 && posts > 100`,
			result: true,
		},
	}

	for _, cas := range cases {
		res, err := Eval(cas.m, cas.expr)
		assert.Nil(t, err)
		assert.Equal(t, res, cas.result)
	}
}
