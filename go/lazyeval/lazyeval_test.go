package lazyeval

import (
	"testing"
)

var testArr = [...]int{1, 1, 2, 3, 5, 8}

func TestLazyFib(t *testing.T) {
	resume := LazyFib()

	for _, val := range testArr {
		realVal := <-resume
		t.Logf("val: %v, realVal: %v\n", val, realVal)
		if val != realVal {
			t.Errorf("val: %v, realVal: %v\tnot equal\n", val, realVal)
		}
	}
}
