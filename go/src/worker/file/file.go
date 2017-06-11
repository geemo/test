package file

import (
	"bytes"
	"fmt"
	"io"
	"os"
)

// File 文件结构体
type File struct {
	Name string
	Buf  bytes.Buffer
}

// ReadFile 读取文件并写入到结构体的buf中
func (f *File) ReadFile() error {
	fd, err := os.Open(f.Name)
	defer fd.Close()
	if err != nil {
		return err
	}

	chunk := make([]byte, 256)
	for {
		n, err := fd.Read(chunk)

		if err == io.EOF {
			return nil
		} else if err != nil {
			return err
		}

		f.Buf.Write(chunk[:n])
	}
}

func (f *File) String() string {
	return fmt.Sprintf("\nfile: %v.\ncontent: %v\n", f.Name, f.Buf.String())
}
