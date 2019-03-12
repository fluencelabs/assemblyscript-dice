import "allocator/tlsf";
//import "allocator/buddy";
//import "allocator/arena";

export function allocate(size: i32) :i32 {
  return memory.allocate(size);
}

export function deallocate(ptr: i32, size: i32): void {
  memory.free(ptr);
}

export function invoke(ptr: i32, size: i32): i32 {

  let inputStr: string = String.fromUTF8(ptr, size);

  let str = "Hello, world! From user " + inputStr;

  let strLen: i32 = str.length;
  let addr = memory.allocate(strLen + 4);
  for (let i = 0; i < 4; i++) {
    let b: u8 = (strLen >> i * 8) as u8 & 0xFF;
    store<u8>(addr + i, b);
  }

  let strAddr = addr + 4;
  for (let i = 0; i < strLen; i++) {
    let b: u8 = str.charCodeAt(i) as u8;
    store<u8>(strAddr + i, b);
  }

  return addr;
}