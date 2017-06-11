package worker

import (
	"fmt"
	"log"
	"worker/file"
)

// Worker 工作协程
func Worker(in, out chan *file.File, wid int) {
	for {
		fmt.Printf("worker: %v\n", wid)
		f := <-in
		process(f)
		out <- f
	}
}

func process(f *file.File) {
	err := f.ReadFile()
	if err != nil {
		log.Fatalf("file read failed, error is: %v\n", err)
	}

	log.Printf("read file %v success\n", f.Name)
}
