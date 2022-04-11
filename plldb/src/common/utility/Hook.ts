import { useState, useCallback, useRef } from 'react';

export function useValue<T>(initial: T) {
	const [value, setValue] = useState(initial);
	const ref = useRef<typeof value>();
	ref.current = value;
	return {
		value,
		setValue,
		ref,
	};
}

export function useBoolean(initial: boolean) {
	const value = useValue(initial);
	const setTrue = useCallback(() => {
		value.setValue(true);
	}, [value.ref]);
	const setFalse = useCallback(() => {
		value.setValue(false);
	}, [value.ref]);
	const toggle = useCallback(() => {
		value.setValue(!value.ref.current!);
	}, [value.ref]);
	return {
		...value,
		setTrue,
		setFalse,
		toggle,
	};
}

export function useBooleanWithData<DataT>(initial: boolean, initialData: DataT) {
	const valueAndData = useValue({
		value: initial,
		data: initialData,
	});
	const setValue = useCallback((value: boolean) => {
		valueAndData.setValue({
			...valueAndData.ref.current!,
			value: value,
		});
	}, [valueAndData.ref]);
	const setTrue = useCallback(() => {
		valueAndData.setValue({
			...valueAndData.ref.current!,
			value: true,
		});
	}, [valueAndData.ref]);
	const setFalse = useCallback(() => {
		valueAndData.setValue({
			...valueAndData.ref.current!,
			value: false,
		});
	}, [valueAndData.ref]);
	const toggle = useCallback(() => {
		valueAndData.setValue({
			...valueAndData.ref.current!,
			value: !valueAndData.ref.current!.value,
		});
	}, [valueAndData.ref]);
	const setData = useCallback((data: DataT) => {
		valueAndData.setValue({
			...valueAndData.ref.current!,
			data: data,
		});
	}, [valueAndData.ref]);
	const cleanData = useCallback(() => {
		valueAndData.setValue({
			...valueAndData.ref.current!,
			data: initialData,
		});
	}, [valueAndData.ref]);
	const setTrueWithData = useCallback((data: DataT) => {
		valueAndData.setValue({
			...valueAndData.ref.current!,
			value: true,
			data: data,
		});
	}, [valueAndData.ref]);
	const setFalseWithData = useCallback(() => {
		valueAndData.setValue({
			...valueAndData.ref.current!,
			value: false,
			data: initialData,
		});
	}, [valueAndData.ref]);
	return {
		value: valueAndData.value.value,
		data: valueAndData.value.data,
		setValue,
		setTrue,
		setFalse,
		toggle,
		setData,
		cleanData,
		setTrueWithData,
		setFalseWithData,
	};
}

export function useOpenLogic(initialState: boolean) {
	const state = useBoolean(initialState);
	return {
		state: state.value,
		setState: state.setValue,
		open: state.setTrue,
		close: state.setFalse,
		toggle: state.toggle,
	};
}

export function useOpenLogicWithData<DataT>(initialState: boolean, initialData: DataT) {
	const state = useBooleanWithData(initialState, initialData);
	return {
		state: state.value,
		data: state.data,
		setState: state.setValue,
		open: state.setTrue,
		close: state.setFalse,
		toggle: state.toggle,
		setData: state.setData,
		cleanData: state.cleanData,
		openWithData: state.setTrueWithData,
		closeWithData: state.setFalseWithData,
	};
}

export function useFormData<DataT extends object>(initialData: DataT) {
	const data = useValue(initialData);
	const setItem = useCallback((key: keyof DataT, value: any) => {
		data.setValue({
			...data.ref.current!,
			[key]: value
		});
	}, []);
	const reset = useCallback(() => {
		data.setValue(initialData);
	}, []);
	return {
		...data,
		setItem,
		reset,
	};
}
