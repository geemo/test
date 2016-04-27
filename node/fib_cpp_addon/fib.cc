#include <node.h>

namespace fib{
	using v8::Exception;
	using v8::FunctionCallbackInfo;
	using v8::Isolate;
	using v8::Local;
	using v8::Number;
	using v8::Object;
	using v8::String;
	using v8::Value;

	double fib(int n, double prev, double next){
		if (n < 2) return prev;
		return fib(n - 1, next, prev + next);
	}

	void execFib(const FunctionCallbackInfo<Value>& args){
		Isolate* isolate = args.GetIsolate();

		if(args.Length() < 1){
			isolate->ThrowException(Exception::TypeError(
				String::NewFromUtf8(isolate, "Wrong number of arguments")));
			return;
		}

		if(!args[0]->IsNumber()){
			isolate->ThrowException(Exception::TypeError(
				String::NewFromUtf8(isolate, "Wrong arguments")));
			return;
		}

		int n = static_cast<int>(args[0]->NumberValue());
		args.GetReturnValue().Set(Number::New(isolate, fib(n, 1, 1)));
	}

	void init(Local<Object> exports, Local<Object> module){
		NODE_SET_METHOD(module, "exports", execFib);
	}

	NODE_MODULE(fib, init)
}