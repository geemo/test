package worker

import (
	"fmt"
	"runtime"
	"testing"
	"worker/file"
)

var files = []file.File{{Name: "file1"}, {Name: "file2"}, {Name: "file2"}, {Name: "file1"}, {Name: "file2"}}

const workerCount = 2

func TestWorker(t *testing.T) {
	in, out := make(chan *file.File), make(chan *file.File)
	runtime.GOMAXPROCS(runtime.NumCPU())

	go input(in)
	for i := 0; i < workerCount; i++ {
		go Worker(in, out, i)
	}
	output(out)
}

func input(in chan *file.File) {
	for {
		if len(files) != 0 {
			f := files[0]
			files = files[1:]
			in <- &f
		}
		// time.Sleep(time.Second)
	}
}

func output(out chan *file.File) {
	for {
		file := <-out
		fmt.Printf("file detail: %v", file)
	}
}
