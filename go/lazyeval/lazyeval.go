package lazyeval

// LazyFib 惰性斐波那契求值函数
func LazyFib() chan int {
	yield := make(chan int)
	prev, curr := 0, 1

	go func() {
		for {
			yield <- curr
			prev, curr = curr, prev+curr
		}
	}()

	return yield
}
